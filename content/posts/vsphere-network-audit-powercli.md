---
title: "Auditing vSphere Network Infrastructure with PowerCLI"
date: 2026-03-13
publish: true
category: posts
tags: [vsphere, powercli, automation, infrastructure, broadcast, cisco, storage]
description: "Three PowerShell scripts that actually tell you what your ESXi hosts are plugged into."
---

So here's the thing — I had to redo the entire cabling diagram of our infrastructure from scratch. And when I say it was done badly, I mean *catastrophically* badly. Cables labelled wrong, hosts connected to ports nobody remembered, uplinks that existed in the config but apparently not in reality. The kind of situation where you pull a cable to see what goes down, and the answer is "everything."

I'm being polite. The original documentation was done with what I can only describe as creative disregard for accuracy.

Redoing it manually — tracing every cable, cross-referencing every switch port — wasn't an option I was willing to accept. It would have taken days, involved a lot of crawling under racks, and ended with a spreadsheet that would start being wrong the moment someone touched a NIC.

So I automated it instead.

Network documentation in virtualized infrastructure is always slightly wrong. Someone added an uplink, changed a portgroup, swapped a NIC, and nobody updated the spreadsheet. The spreadsheet is now a work of fiction. But the *hypervisor* always knows the truth — ESXi reads CDP and LLDP data from the physical switches, which means you can ask it directly: "what are you plugged into?"

I wrote three PowerCLI scripts to do exactly that.

## What These Scripts Do

They query your vCenter, walk every connected ESXi host, and extract the actual network topology — NIC by NIC — using CDP and LLDP data straight from the hypervisor. No guessing, no manual cross-referencing with your switch config. The physical switch tells the ESXi host who it is, and we just ask nicely.

Three scripts, three levels of detail:

1. **`ESXi-NIC-Description.ps1`** — Physical NIC inventory (PCI address, driver, description)
2. **`vSphere-Audit.ps1`** — Full audit: uplinks + portgroup mapping, one CSV
3. **`vSphere-Audit-Notion.ps1`** — Simplified export, structured for Notion import

## Prerequisites

- **VMware PowerCLI** installed: `Install-Module VMware.PowerCLI`
- Read access to your vCenter and ESXi hosts
- CDP or LLDP enabled on your physical switches (if not, the switch columns will be empty — but the NIC inventory still works)
- PowerShell 5.1+ or PowerShell 7+

## Configuration

All three scripts share the same two variables at the top:

```powershell
$vcServer  = "vcenter.lab.local"          # Your vCenter address
$basePath  = "C:\Scripts\vSphere"         # Where CSVs will be saved
```

Change those before running. That's it.

---

## Script 1: NIC Inventory with PCI Details

### `ESXi-NIC-Description.ps1`

```powershell
$vcServer = "vcenter.lab.local"
$basePath  = "C:\Scripts\vSphere"
$csvPath   = Join-Path $basePath "ESXi-NIC-Description.csv"
# ========================================

Write-Host "Connecting to $vcServer ..." -ForegroundColor Cyan
Connect-VIServer -Server $vcServer | Out-Null

$report = @()

Get-VMHost | Where-Object { $_.ConnectionState -eq 'Connected' } | ForEach-Object {
    $esx    = $_
    $netSys = Get-View $esx.ExtensionData.ConfigManager.NetworkSystem
    $esxcli = Get-EsxCli -VMHost $esx -V2

    # Get PCI / Description info via esxcli
    $nicList = $esxcli.network.nic.list.Invoke()

    foreach ($pnic in $netSys.NetworkInfo.Pnic) {

        # Cross-reference with esxcli by vmnic name
        $nicInfo = $nicList | Where-Object { $_.Name -eq $pnic.Device }

        $report += [PSCustomObject]@{
            "Host"        = $esx.Name
            "vmnic"       = $pnic.Device
            "MAC"         = $pnic.Mac
            "Speed Mb"    = if ($pnic.LinkSpeed) { $pnic.LinkSpeed.SpeedMb } else { "Down" }
            "PCI Address" = $nicInfo.PCIDevice       # e.g. 0000:04:00.0 → bus:slot.function
            "Driver"      = $nicInfo.Driver          # e.g. ixgbe, vmxnet3, ntg3
            "Description" = $nicInfo.Description     # e.g. "Intel X550 port 0" — often includes physical port number
        }
    }
}

$report |
  Sort-Object Host, vmnic |
  Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8

Write-Host "Export: $csvPath  ($($report.Count) rows)" -ForegroundColor Green

Disconnect-VIServer -Server $vcServer -Confirm:$false | Out-Null
```

**What it gives you:** physical NIC inventory for every connected ESXi host, enriched with PCI data from `esxcli`. Useful for identifying which driver is running, the PCI address of each NIC, and — crucially — the physical port number when the Description field cooperates.

### Output columns

| Column | Description |
| --- | --- |
| `Host` | ESXi host name |
| `vmnic` | Interface name (e.g. `vmnic0`) |
| `MAC` | MAC address |
| `Speed Mb` | Link speed in Mb/s, or `Down` if disconnected |
| `PCI Address` | PCI address of the NIC (e.g. `0000:04:00.0`) |
| `Driver` | Driver in use (e.g. `ixgbe`, `ntg3`) |
| `Description` | Vendor description — often includes physical port number |

**Output file:** `ESXi-NIC-Description.csv`

---

## Script 2: Full Network Audit (CDP/LLDP + Portgroup Mapping)

### `vSphere-Audit.ps1`

The main script. Produces a single CSV with two distinct sections identified by a `Section` column.

```powershell
$vcServer = "vcenter.lab.local"
$basePath = "C:\Scripts\vSphere"
$csvOutputPath = Join-Path $basePath "ESXi-Network-Audit.csv"
# ========================================

# Helper function to resolve CDP/LLDP data for a pNIC
function Get-HintInfo {
    param(
        [object]$NetSys,
        [string]$PnicDevice
    )
    $result = [PSCustomObject]@{
        DevId  = $null
        PortId = $null
        VlanId = $null
    }

    if (-not $PnicDevice) { return $result }

    $hints = $NetSys.QueryNetworkHint([string[]]@($PnicDevice))
    if (-not $hints) { return $result }

    foreach ($h in $hints) {
        if ($h.ConnectedSwitchPort) {
            $result.DevId  = $h.ConnectedSwitchPort.DevId
            $result.PortId = $h.ConnectedSwitchPort.PortId
            $result.VlanId = $h.ConnectedSwitchPort.Vlan
        }
        elseif ($h.LldpInfo) {
            $result.DevId  = ($h.LldpInfo.Parameter | Where-Object { $_.Key -eq "System Name" }).Value
            $result.PortId = $h.LldpInfo.PortId
            $result.VlanId = ($h.LldpInfo.Parameter | Where-Object { $_.Key -like "*VLAN*" }).Value
        }
        if ($result.DevId -or $result.PortId) { break }
    }

    return $result
}

Write-Host "Connecting to $vcServer ..." -ForegroundColor Cyan
Connect-VIServer -Server $vcServer | Out-Null

$report = @()

# ============================================================
# SECTION 1: UPLINKS / CDP / LLDP  (vSS + vDS, all pNICs)
# ============================================================
Write-Host "Collecting uplinks CDP/LLDP ..." -ForegroundColor Cyan

Get-VMHost | Where-Object { $_.ConnectionState -eq 'Connected' } | ForEach-Object {
    $esx         = $_
    $clusterName = (Get-Cluster -VMHost $esx -ErrorAction SilentlyContinue).Name
    $netSys      = Get-View $esx.ExtensionData.ConfigManager.NetworkSystem

    # Map pNIC -> standard vSwitch
    $pnicToVswitch = @{}
    foreach ($vs in $netSys.NetworkInfo.Vswitch) {
        if ($vs.Spec.Bridge -and $vs.Spec.Bridge.NicDevice) {
            foreach ($p in $vs.Spec.Bridge.NicDevice) {
                $pnicToVswitch[$p] = $vs.Name
            }
        }
    }

    foreach ($pnic in $netSys.NetworkInfo.Pnic) {
        $pnicName = $pnic.Device
        $pnicMac  = $pnic.Mac
        $vSwitch  = if ($pnicToVswitch.ContainsKey($pnicName)) { $pnicToVswitch[$pnicName] } else { $null }

        $hints = $netSys.QueryNetworkHint([string[]]@($pnicName))

        if (-not $hints) {
            $report += [PSCustomObject]@{
                Section    = "Uplinks"
                Cluster    = $clusterName
                VMHost     = $esx.Name
                PNic       = $pnicName
                PNicMac    = $pnicMac
                VSwitch    = $vSwitch
                VDSwitch   = $null
                Portgroup  = $null
                TeamType   = $null
                UplinkName = $null
                Protocol   = $null
                SwitchName = $null
                SwitchPort = $null
                VLAN       = $null
                SpeedMb    = $pnic.LinkSpeed.SpeedMb
                Duplex     = $pnic.LinkSpeed.Duplex
            }
        }
        else {
            foreach ($hint in $hints) {
                $protocol   = $null
                $switchName = $null
                $switchPort = $null
                $vlan       = $null

                if ($hint.ConnectedSwitchPort) {
                    $protocol   = "CDP"
                    $switchName = $hint.ConnectedSwitchPort.DevId
                    $switchPort = $hint.ConnectedSwitchPort.PortId
                    $vlan       = $hint.ConnectedSwitchPort.Vlan
                }
                elseif ($hint.LldpInfo) {
                    $protocol   = "LLDP"
                    $switchPort = $hint.LldpInfo.PortId
                    $sysName    = ($hint.LldpInfo.Parameter | Where-Object { $_.Key -eq "System Name" }).Value
                    if ($sysName) { $switchName = $sysName }
                    $vlanParam  = $hint.LldpInfo.Parameter | Where-Object { $_.Key -like "*VLAN*" }
                    if ($vlanParam) { $vlan = $vlanParam.Value }
                }

                $report += [PSCustomObject]@{
                    Section    = "Uplinks"
                    Cluster    = $clusterName
                    VMHost     = $esx.Name
                    PNic       = $pnicName
                    PNicMac    = $pnicMac
                    VSwitch    = $vSwitch
                    VDSwitch   = $null
                    Portgroup  = $null
                    TeamType   = $null
                    UplinkName = $null
                    Protocol   = $protocol
                    SwitchName = $switchName
                    SwitchPort = $switchPort
                    VLAN       = $vlan
                    SpeedMb    = $pnic.LinkSpeed.SpeedMb
                    Duplex     = $pnic.LinkSpeed.Duplex
                }
            }
        }
    }
}

Write-Host "Uplinks section: $($report.Count) rows collected." -ForegroundColor Green

# ============================================================
# SECTION 2: PORTGROUPS <-> UPLINKS  (vDS only)
# ============================================================
Write-Host "Collecting portgroups/uplinks vDS ..." -ForegroundColor Cyan

$pgStartIndex = $report.Count

Get-Cluster | Get-VMHost -State Connected | ForEach-Object {
    $esx         = $_
    $clusterName = (Get-Cluster -VMHost $esx -ErrorAction SilentlyContinue).Name
    $netSys      = Get-View $esx.ExtensionData.ConfigManager.NetworkSystem

    $uplinkMap = @{}

    Get-VDSwitch -VMHost $esx | ForEach-Object {
        $vdsw = $_

        Get-VDPort -VDSwitch $vdsw -Uplink |
          Where-Object { $_.ExtensionData.Connectee.ConnectedEntity -eq $esx.ExtensionData.MoRef } |
          ForEach-Object {
              $uplinkMap[$_.Name] = $_.ExtensionData.Connectee.NicKey
          }

        Get-VDPortgroup -VDSwitch $vdsw | Where-Object { -not $_.IsUplink } | ForEach-Object {
            $vdpg    = $_
            $teaming = $vdpg.ExtensionData.Config.DefaultPortConfig.UplinkTeamingPolicy
            $active  = $teaming.UplinkPortOrder.ActiveUplinkPort
            $standby = $teaming.UplinkPortOrder.StandbyUplinkPort

            foreach ($teamEntry in @(
                @{ Names = $active;  Type = "Active" },
                @{ Names = $standby; Type = "Standby" }
            )) {
                foreach ($uplinkName in $teamEntry.Names) {
                    if (-not $uplinkMap.ContainsKey($uplinkName)) { continue }

                    $pnicKey = $uplinkMap[$uplinkName]
                    $pnicObj = $netSys.NetworkInfo.Pnic | Where-Object { $_.Key -eq $pnicKey }

                    if (-not $pnicObj) {
                        Write-Warning "pNIC not found for key '$pnicKey' on $($esx.Name) / uplink '$uplinkName'"
                        continue
                    }

                    $hintInfo = Get-HintInfo -NetSys $netSys -PnicDevice $pnicObj.Device

                    $report += [PSCustomObject]@{
                        Section    = "Portgroups"
                        Cluster    = $clusterName
                        VMHost     = $esx.Name
                        PNic       = $pnicObj.Device
                        PNicMac    = $pnicObj.Mac
                        VSwitch    = $null
                        VDSwitch   = $vdsw.Name
                        Portgroup  = $vdpg.Name
                        TeamType   = $teamEntry.Type
                        UplinkName = $uplinkName
                        Protocol   = $null
                        SwitchName = $hintInfo.DevId
                        SwitchPort = $hintInfo.PortId
                        VLAN       = $hintInfo.VlanId
                        SpeedMb    = $null
                        Duplex     = $null
                    }
                }
            }
        }
    }
}

Write-Host "Portgroups section: $($report.Count - $pgStartIndex) rows collected." -ForegroundColor Green

# ============================================================
# EXPORT
# ============================================================
$report |
  Sort-Object Section, Cluster, VMHost, VDSwitch, Portgroup, TeamType, PNic |
  Export-Csv -Path $csvOutputPath -NoTypeInformation -Encoding UTF8

Write-Host "CSV exported: $csvOutputPath  ($($report.Count) total rows)" -ForegroundColor Green

Disconnect-VIServer -Server $vcServer -Confirm:$false | Out-Null
```

### Section 1 — `Uplinks`

For each pNIC on each host, queries CDP or LLDP data to identify the upstream physical switch. Covers both standard vSwitches (vSS) and Distributed Switches (vDS).

### Section 2 — `Portgroups`

For each vDS portgroup, resolves the active and standby uplinks back to the actual pNIC, then crosses with CDP/LLDP data.

### Script 2 Output

| Column | Description |
| --- | --- |
| `Section` | `Uplinks` or `Portgroups` |
| `Cluster` | vSphere cluster name |
| `VMHost` | ESXi host name |
| `PNic` | Physical interface (e.g. `vmnic2`) |
| `PNicMac` | MAC address of the pNIC |
| `VSwitch` | Standard vSwitch (Uplinks section) |
| `VDSwitch` | Distributed Switch (Portgroups section) |
| `Portgroup` | vDS portgroup name (Portgroups section) |
| `TeamType` | Uplink role: `Active` or `Standby` |
| `UplinkName` | Logical uplink name on the vDS |
| `Protocol` | Discovery protocol: `CDP` or `LLDP` |
| `SwitchName` | Physical switch name or ID |
| `SwitchPort` | Physical switch port (e.g. `GigabitEthernet1/0/12`) |
| `VLAN` | VLAN from CDP/LLDP |
| `SpeedMb` | Speed in Mb/s (Uplinks section only) |
| `Duplex` | Duplex mode (Uplinks section only) |

**Output file:** `ESXi-Network-Audit.csv`

---

## Script 3: Simplified Export for Notion

### `vSphere-Audit-Notion.ps1`

A lighter version of `vSphere-Audit.ps1`: one row per pNIC, with a column structure designed for direct import into a Notion database. Two columns (`Traffic Role`, `Comment`) are left blank for manual input after import.

```powershell
$vcServer = "vcenter.lab.local"
$basePath = "C:\Scripts\vSphere"
$csvOutputPath = Join-Path $basePath "ESXi-Network-Notion.csv"
# ========================================

# CDP/LLDP helper function
function Get-HintInfo {
    param(
        [object]$NetSys,
        [string]$PnicDevice
    )
    $result = [PSCustomObject]@{
        SwitchName = $null
        SwitchPort = $null
        VLAN       = $null
        Protocol   = $null
    }

    if (-not $PnicDevice) { return $result }

    $hints = $NetSys.QueryNetworkHint([string[]]@($PnicDevice))
    if (-not $hints) { return $result }

    foreach ($h in $hints) {
        if ($h.ConnectedSwitchPort) {
            $result.Protocol   = "CDP"
            $result.SwitchName = $h.ConnectedSwitchPort.DevId
            $result.SwitchPort = $h.ConnectedSwitchPort.PortId
            $result.VLAN       = $h.ConnectedSwitchPort.Vlan
        }
        elseif ($h.LldpInfo) {
            $result.Protocol   = "LLDP"
            $result.SwitchPort = $h.LldpInfo.PortId
            $sysName = ($h.LldpInfo.Parameter | Where-Object { $_.Key -eq "System Name" }).Value
            if ($sysName) { $result.SwitchName = $sysName }
            $vlanParam = $h.LldpInfo.Parameter | Where-Object { $_.Key -like "*VLAN*" }
            if ($vlanParam) { $result.VLAN = $vlanParam.Value }
        }
        if ($result.SwitchName -or $result.SwitchPort) { break }
    }

    return $result
}

Write-Host "Connecting to $vcServer ..." -ForegroundColor Cyan
Connect-VIServer -Server $vcServer | Out-Null

$report = @()

Get-VMHost | Where-Object { $_.ConnectionState -eq 'Connected' } | ForEach-Object {
    $esx    = $_
    $netSys = Get-View $esx.ExtensionData.ConfigManager.NetworkSystem

    # Map pNIC → standard vSwitch
    $pnicToVSS = @{}
    foreach ($vs in $netSys.NetworkInfo.Vswitch) {
        if ($vs.Spec.Bridge -and $vs.Spec.Bridge.NicDevice) {
            foreach ($p in $vs.Spec.Bridge.NicDevice) {
                $pnicToVSS[$p] = $vs.Name
            }
        }
    }

    # Map pNIC → vDS
    $pnicKeyToVDS = @{}
    Get-VDSwitch -VMHost $esx -ErrorAction SilentlyContinue | ForEach-Object {
        $vdsw = $_
        Get-VDPort -VDSwitch $vdsw -Uplink -ErrorAction SilentlyContinue |
          Where-Object { $_.ExtensionData.Connectee.ConnectedEntity -eq $esx.ExtensionData.MoRef } |
          ForEach-Object {
              $pnicKeyToVDS[$_.ExtensionData.Connectee.NicKey] = $vdsw.Name
          }
    }

    # One row per pNIC
    foreach ($pnic in $netSys.NetworkInfo.Pnic) {

        # Resolve vSwitch/vDS: check vSS first, then vDS by key
        $virtualSwitch = $null
        if ($pnicToVSS.ContainsKey($pnic.Device)) {
            $virtualSwitch = $pnicToVSS[$pnic.Device]
        }
        elseif ($pnicKeyToVDS.ContainsKey($pnic.Key)) {
            $virtualSwitch = $pnicKeyToVDS[$pnic.Key]
        }

        $hint = Get-HintInfo -NetSys $netSys -PnicDevice $pnic.Device

        $report += [PSCustomObject]@{
            "Host"          = $esx.Name          # → Notion relation "Hosts"
            "vmnic"         = $pnic.Device        # e.g. vmnic0
            "MAC vmnic"     = $pnic.Mac           # e.g. 00:50:56:ab:cd:ef
            "vSwitch/vDS"   = $virtualSwitch      # e.g. vSwitch0 or dvSwitch-Prod
            "VLANs"         = $hint.VLAN          # from CDP/LLDP (may be empty)
            "Switch"        = $hint.SwitchName    # → Notion relation "Cisco Switches"
            "Switch Port"   = $hint.SwitchPort    # e.g. GigabitEthernet1/0/12
            "Protocol"      = $hint.Protocol      # CDP | LLDP | empty
            "Traffic Role"  = ""                  # fill manually in Notion
            "Comment"       = ""                  # fill manually in Notion
        }
    }
}

$report |
  Sort-Object Host, vmnic |
  Export-Csv -Path $csvOutputPath -NoTypeInformation -Encoding UTF8

Write-Host "Notion export: $csvOutputPath  ($($report.Count) rows)" -ForegroundColor Green

Disconnect-VIServer -Server $vcServer -Confirm:$false | Out-Null
```

### Script 3 Output

| Column | Description |
| --- | --- |
| `Host` | ESXi host → Notion relation to **Hosts** table |
| `vmnic` | Interface name (e.g. `vmnic0`) |
| `MAC vmnic` | MAC address |
| `vSwitch/vDS` | Virtual switch (vSS or vDS) |
| `VLANs` | VLAN from CDP/LLDP |
| `Switch` | Physical switch name → Notion relation to **Cisco Switches** table |
| `Switch Port` | Physical switch port |
| `Protocol` | `CDP`, `LLDP`, or empty |
| `Traffic Role` | *(fill manually in Notion)* |
| `Comment` | *(fill manually in Notion)* |

**Output file:** `ESXi-Network-Notion.csv`

---

## Running the Scripts

```powershell
.\ESXi-NIC-Description.ps1
.\vSphere-Audit.ps1
.\vSphere-Audit-Notion.ps1
```

Each script connects to vCenter, collects data, exports its CSV, then disconnects cleanly.

## A Few Notes

- Hosts in `Disconnected` or `Maintenance` state are excluded from collection.
- If CDP/LLDP data isn't available (switch doesn't support it, or the feature is disabled), the `Switch`, `Switch Port`, and `VLAN` columns will be empty — but the row is still created with whatever data is available.
- The Notion script is designed to feed a relational database with linked tables: `Hosts` ↔ `NICs` ↔ `Cisco Switches`. Import the CSV, then set up the relations manually.

## The Switch Side: Cisco IOS Commands

PowerCLI gives you the ESXi view of the world. The Cisco switch has the exact same topology data from its own perspective — and cross-referencing both is how you catch discrepancies. A cable labeled wrong, a port description that was never updated, an uplink that ESXi thinks is on `Gi1/0/5` but is actually on `Gi1/0/15` — you only find that by looking at both sides.

All of the commands below are read-only. Nothing gets changed. Nothing breaks. You're just asking the switch to tell you what it knows.

### CDP Neighbors

CDP (Cisco Discovery Protocol) is the proprietary equivalent of LLDP. If your switches advertise CDP, this is the fastest way to see what's physically connected to each port.

```text
show cdp neighbors
show cdp neighbors detail
show cdp neighbors interface Gi1/0/1 detail
```

What you get: device name (ESXi hostname, Unity SP name, iLO management port), platform string, local port, remote port, and management IP. Cross-reference the device name and remote port with your `SwitchName` and `SwitchPort` columns from the PowerCLI CSV — they should match exactly.

### LLDP Neighbors

If the switches run LLDP instead of (or alongside) CDP:

```text
show lldp neighbors
show lldp neighbors detail
show lldp neighbors interface Gi1/0/1 detail
```

What you get: System Name, Port ID, capabilities (Bridge, Router, Station), and VLAN information. The `System Name` maps directly to the `SwitchName` column in your CSV when the ESXi hosts are advertising LLDP.

### MAC Address Table

The MAC address table is the L2 ground truth. Every device that has ever sent a frame through a port ends up here.

```text
show mac address-table
show mac address-table interface Gi1/0/1
show mac address-table vlan 123
```

What you get: MAC address ↔ VLAN ↔ physical port mapping. Take the `PNicMac` value from your PowerCLI CSV and look it up here — if it shows up on the wrong port or wrong VLAN, you've found a documentation error (or a cabling error). Works equally well for iLO management ports and Unity Ethernet ports.

### Interface Details

To verify the port configuration — speed, duplex, trunk/access mode, allowed VLANs:

```text
show interfaces status
show interfaces Gi1/0/1
show interfaces Gi1/0/1 switchport
```

What you get: port description (should match your documentation), access vs. trunk mode, native VLAN, allowed VLAN list, error counters. The description field is where you validate your cable labels. If it says `esx01-vmnic0` and CDP says `esx02`, someone moved a cable and didn't update the label.

### ARP (L3 Ports)

For management VLANs and routed interfaces, the ARP table maps IPs to MACs:

```text
show arp
show arp | include <esxi-or-ilo-ip>
```

What you get: IP ↔ MAC ↔ interface mapping for any L3-reachable device. Useful for confirming that the management IP of an ESXi host resolves to the MAC you expect from the PowerCLI output.

---

## The Storage Side: Dell Unity with uemcli

The storage array has its own NICs, its own MAC addresses, its own ports. If you're documenting a full infrastructure stack — not just the compute side — you need the storage side too. On Dell Unity, `uemcli` is the CLI tool that gives you this.

**Step 1 — List Ethernet ports:**

```bash
uemcli -d <unity-ip> -u <user> -p <'password'> /net/port/eth show -output csv
```

Returns all Ethernet ports on both Storage Processors (SP A and SP B): port name, MAC address, current speed, MTU, link state. These MACs are what you'll find in the switch MAC address table when you run `show mac address-table interface` on the ports your Unity is connected to.

**Step 2 — List iSCSI/NAS interfaces:**

```bash
uemcli -d <unity-ip> -u <user> -p <'password'> /net/if show
```

Returns the IP addresses configured on each Ethernet port — useful for confirming that the iSCSI or NAS interfaces are on the expected VLANs and reachable from the right ports.

**Step 3 — FC/SAN note:**

For Fibre Channel connectivity, you don't use uemcli for port discovery — you work from the FC switch side. On a Cisco MDS or Nexus:

```text
show fcns database
show flogi database
```

`show flogi database` gives you the WWN of each device logged into the fabric, which port it's on, and the VSAN. This is the FC equivalent of the MAC address table.

Cross-reference the port MACs (from Step 1) with `show mac address-table` on the Ethernet switches to confirm which physical switch port each Unity SP port is plugged into.

---

## Putting It All Together

Here's the end-to-end workflow that ties all three tools into a single, defensible infrastructure map:

1. **Run PowerCLI** → generates `ESXi-Network-Audit.csv` and `ESXi-Network-Notion.csv`. You now have every ESXi uplink, its MAC, its CDP/LLDP-reported switch name, and its switch port.

2. **Validate from the switch side** — for each row in the CSV, SSH to the reported switch and run:
   - `show cdp neighbors interface Gi1/0/1 detail` → confirms the remote device is `esx01` on port `vmnic0`
   - `show mac address-table interface Gi1/0/1` → MAC matches `PNicMac` in the CSV
   - `show interfaces Gi1/0/1 switchport` → VLAN matches what the portgroup expects

3. **Run uemcli** → get storage port MACs from both SPs. Cross-reference with `show mac address-table` on the storage-facing switches to confirm which physical port each Unity SP NIC is connected to.

4. **Feed everything into Notion** — one row per physical connection:
   - Switch: `LEAF01` | Port: `Gi1/0/1` | Connected device: `esx01` | Device type: ESXi | MAC: `<vmnic0 MAC>` | VLANs: management, vMotion | Validated: ✓

At the end of this process you have a complete, cross-validated picture of your infrastructure — compute, storage, and switching — without touching a single cable.

---

## What I Learned

Working in broadcast infrastructure means your network documentation is always mission-critical. When a live feed drops, you don't have time to dig through outdated spreadsheets trying to figure out which switch port goes where.

These scripts came from that exact frustration. The combination of PowerCLI's access to the vSphere API and CDP/LLDP discovery data from the physical switches gives you a ground-truth view of your network — what's actually connected, not what someone wrote down six months ago.

The Notion export adds a practical angle: import the CSV, manually tag the traffic roles (`Management`, `vMotion`, `VM Traffic`, `Storage`...), and you end up with a living, queryable network map instead of a stale spreadsheet.

Pretty neat for a few hundred lines of PowerShell.

---

*Built with VMware PowerCLI on a vSphere environment. Requires CDP or LLDP enabled on physical switches for full topology resolution.*
