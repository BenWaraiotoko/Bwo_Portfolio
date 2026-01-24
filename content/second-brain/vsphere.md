---
title: VMware vSphere
date: 2025-12-28
description: VMware vSphere enterprise virtualization platform guide
tags:
  - virtualization
  - vmware
  - vsphere
  - enterprise
  - hypervisor
  - esxi
category: second-brain
publish: true
---
## Summary

VMware vSphere is an enterprise virtualization platform consisting of ESXi hypervisor and vCenter Server management. It's the industry standard for enterprise virtualization, offering advanced features like vMotion, DRS, and HA for production workloads.

## Key concepts

- **ESXi**: Bare-metal hypervisor that runs directly on server hardware
- **vCenter Server**: Centralized management platform for ESXi hosts
- **vMotion**: Live migration of running VMs between hosts without downtime
- **DRS (Distributed Resource Scheduler)**: Automatic load balancing across hosts
- **HA (High Availability)**: Automatic VM restart on host failure
- **vSAN**: Software-defined storage using local disks
- **Virtual machines**: Isolated compute environments running guest operating systems

## Details

### Architecture components

**Core components:**
- **ESXi Host**: Type 1 hypervisor running on physical hardware
- **vCenter Server**: Centralized management and orchestration
- **vSphere Client**: Web-based management interface (HTML5)
- **vSphere API**: Programmatic access for automation

**Storage:**
- **VMFS**: VMware's clustered file system
- **NFS**: Network File System datastores
- **vSAN**: Hyper-converged storage solution
- **vVols**: Virtual volumes with array integration

**Networking:**
- **Standard Switch (vSS)**: Per-host virtual networking
- **Distributed Switch (vDS)**: Cluster-wide virtual networking
- **NSX**: Software-defined networking and security

### ESXi host management

**Access methods:**
- ESXi Host Client: `https://esxi-ip/ui`
- vCenter Server: Centralized management
- SSH: Enable in Host → Manage → Services → TSM-SSH
- ESXi Shell: Direct console access (DCU)

**ESXi CLI commands:**
```bash
# View ESXi version
vmware -v

# List running VMs
esxcli vm process list

# Restart management agents
services.sh restart

# View network configuration
esxcli network ip interface ipv4 get
esxcli network nic list

# View storage adapters
esxcli storage core adapter list

# View datastores
esxcli storage filesystem list

# View host hardware
esxcli hardware platform get
esxcli hardware memory get

# Maintenance mode
vim-cmd hostsvc/maintenance_mode_enter
vim-cmd hostsvc/maintenance_mode_exit

# Reboot/shutdown host
esxcli system shutdown reboot -r "planned reboot"
esxcli system shutdown poweroff -r "planned shutdown"
```

### Virtual machine management

**VM operations via CLI:**
```bash
# List all VMs
vim-cmd vmsvc/getallvms

# Get VM power state
vim-cmd vmsvc/power.getstate <vmid>

# Power on VM
vim-cmd vmsvc/power.on <vmid>

# Power off VM
vim-cmd vmsvc/power.off <vmid>

# Shutdown guest OS
vim-cmd vmsvc/power.shutdown <vmid>

# Reset VM
vim-cmd vmsvc/power.reset <vmid>

# Create snapshot
vim-cmd vmsvc/snapshot.create <vmid> "snapshot-name" "description" 0 0

# List snapshots
vim-cmd vmsvc/snapshot.get <vmid>

# Revert to snapshot
vim-cmd vmsvc/snapshot.revert <vmid> <snapshotid>

# Delete snapshot
vim-cmd vmsvc/snapshot.remove <vmid> <snapshotid>

# Reload VM configuration
vim-cmd vmsvc/reload <vmid>

# Unregister VM
vim-cmd vmsvc/unregister <vmid>

# Register VM
vim-cmd solo/registervm /vmfs/volumes/datastore/vm/vm.vmx
```

**VM file locations:**
```bash
# VM files on datastore
cd /vmfs/volumes/datastore-name/vm-name/

# Key files:
# vmname.vmx          - VM configuration file
# vmname.vmdk         - Virtual disk descriptor
# vmname-flat.vmdk    - Virtual disk data
# vmname.nvram        - BIOS/EFI settings
# vmname.vmsd         - Snapshot metadata
# vmname.log          - VM log files
```

### PowerCLI (PowerShell automation)

**Installation:**
```powershell
# Install PowerCLI module
Install-Module -Name VMware.PowerCLI -Scope CurrentUser

# Import module
Import-Module VMware.PowerCLI

# Set PowerCLI configuration
Set-PowerCLIConfiguration -InvalidCertificateAction Ignore -Confirm:$false
```

**Common PowerCLI commands:**
```powershell
# Connect to vCenter
Connect-VIServer -Server vcenter.domain.com -User administrator@vsphere.local

# Get all VMs
Get-VM

# Get VM details
Get-VM -Name "vm-name" | Select-Object Name, PowerState, NumCpu, MemoryGB

# Power operations
Start-VM -VM "vm-name"
Stop-VM -VM "vm-name" -Confirm:$false
Restart-VM -VM "vm-name" -Confirm:$false
Shutdown-VMGuest -VM "vm-name" -Confirm:$false

# Snapshot operations
New-Snapshot -VM "vm-name" -Name "snapshot-name" -Description "description"
Get-Snapshot -VM "vm-name"
Set-VM -VM "vm-name" -Snapshot "snapshot-name" -Confirm:$false
Remove-Snapshot -Snapshot "snapshot-name" -Confirm:$false

# Clone VM
New-VM -Name "new-vm" -VM "template-vm" -VMHost "esxi-host" -Datastore "datastore"

# Move VM between hosts (vMotion)
Move-VM -VM "vm-name" -Destination "target-host"

# Storage vMotion
Move-VM -VM "vm-name" -Datastore "target-datastore"

# Get cluster information
Get-Cluster
Get-Cluster -Name "cluster-name" | Get-VM

# DRS configuration
Get-Cluster "cluster-name" | Set-Cluster -DrsEnabled $true -DrsAutomationLevel FullyAutomated

# Get host information
Get-VMHost
Get-VMHost | Select-Object Name, ConnectionState, PowerState, Version

# Datastore information
Get-Datastore
Get-Datastore | Select-Object Name, CapacityGB, FreeSpaceGB

# Network information
Get-VirtualSwitch
Get-VirtualPortGroup
Get-VMHostNetworkAdapter

# Disconnect from vCenter
Disconnect-VIServer -Confirm:$false
```

### vCenter Server management

**vCenter services:**
```bash
# Service control (VCSA)
service-control --status --all
service-control --stop --all
service-control --start --all
service-control --restart vmware-vpxd

# Backup vCenter
/usr/lib/vmware-vmon/vmon-cli --backup /tmp/backup.tar.gz

# Check vCenter database
/opt/vmware/vpostgres/current/bin/psql -U postgres -d VCDB -c "SELECT version();"
```

**vCenter Server Appliance (VCSA) shell:**
```bash
# Access via SSH or DCUI
# Default shell: appliancesh

# Exit to bash
shell.set --enabled true
shell

# Disk usage
df -h

# View logs
tail -f /var/log/vmware/vpxd/vpxd.log
```

### Storage management

**Datastore operations:**
```bash
# List datastores
esxcli storage filesystem list

# Rescan storage adapters
esxcli storage core adapter rescan --all

# Create VMFS datastore
esxcli storage filesystem automount

# Extend datastore
esxcli storage vmfs extent add -p /vmfs/devices/disks/naa.xxx -v datastore-name

# Mount NFS datastore
esxcli storage nfs add --host nfs-server --share /export/path --volume-name nfs-datastore
```

**vSAN commands:**
```bash
# vSAN cluster status
esxcli vsan cluster get

# vSAN disk status
esxcli vsan storage list

# Resync objects
esxcli vsan policy setpolicy --uuid <uuid>
```

### Networking

**Network configuration:**
```bash
# List virtual switches
esxcli network vswitch standard list

# Add port group
esxcli network vswitch standard portgroup add --portgroup-name=vlan20 --vswitch-name=vSwitch0

# Set VLAN
esxcli network vswitch standard portgroup set --portgroup-name=vlan20 --vlan-id=20

# List VMkernel adapters
esxcli network ip interface ipv4 get

# Add VMkernel interface
esxcli network ip interface add --interface-name=vmk1 --portgroup-name=vMotion

# Set IP address
esxcli network ip interface ipv4 set --interface-name=vmk1 --ipv4=192.168.1.10 --netmask=255.255.255.0 --type=static

# Enable vMotion on VMkernel
vim-cmd hostsvc/vmotion/vnic_set vmk1
```

### High Availability (HA)

**HA cluster configuration:**
- Minimum 2 ESXi hosts required
- Shared storage (VMFS, NFS, vSAN)
- Network redundancy recommended
- Configure via vCenter: Cluster → Configure → vSphere HA

**HA features:**
- VM restart on host failure
- Host monitoring and isolation response
- VM monitoring (application-level)
- Admission control for failover capacity

### DRS (Distributed Resource Scheduler)

**DRS automation levels:**
- **Manual**: User approves all recommendations
- **Partially Automated**: User approves VM placement
- **Fully Automated**: Automatic VM placement and migration

**DRS rules:**
- VM-VM affinity: Keep VMs together
- VM-VM anti-affinity: Keep VMs separated
- VM-Host affinity: Bind VMs to specific hosts
- VM-Host anti-affinity: Keep VMs off specific hosts

### Performance monitoring

**esxtop command:**
```bash
# Interactive performance monitor
esxtop

# Key sections:
# c - CPU
# m - Memory
# d - Disk
# n - Network
# v - Virtual machine

# Batch mode for logging
esxtop -b -n 60 > esxtop.log
```

**Performance metrics:**
```bash
# CPU usage
esxcli hardware cpu global get

# Memory usage
esxcli hardware memory get

# VM statistics
vim-cmd vmsvc/get.summary <vmid>
```

## Examples

**Bulk VM power operations:**
```powershell
# PowerCLI: Power off all VMs in folder
Get-Folder "Test-VMs" | Get-VM | Stop-VM -Confirm:$false

# Start VMs with specific tag
Get-VM -Tag "Production" | Start-VM
```

**Create multiple VMs from template:**
```powershell
1..10 | ForEach-Object {
    New-VM -Name "web-server-$_" -Template "ubuntu-template" `
           -VMHost "esxi-01" -Datastore "datastore1" `
           -ResourcePool "Web-Servers"
}
```

**Export VM list to CSV:**
```powershell
Get-VM | Select-Object Name, PowerState, NumCpu, MemoryGB, UsedSpaceGB, Notes |
Export-Csv -Path "vm-inventory.csv" -NoTypeInformation
```

**Automated snapshot cleanup:**
```powershell
# Remove snapshots older than 7 days
$oldDate = (Get-Date).AddDays(-7)
Get-VM | Get-Snapshot | Where-Object {$_.Created -lt $oldDate} |
Remove-Snapshot -Confirm:$false
```

**Health check script:**
```powershell
# ESXi host health check
Get-VMHost | Select-Object Name, ConnectionState, PowerState, Version, Build |
Format-Table -AutoSize

# Check datastore space
Get-Datastore | Where-Object {$_.FreeSpaceGB -lt 100} |
Select-Object Name, CapacityGB, FreeSpaceGB
```

## Resources

- [VMware vSphere Documentation](https://docs.vmware.com/en/VMware-vSphere/)
- [VMware PowerCLI Documentation](https://developer.vmware.com/powercli)
- [VMware KB (Knowledge Base)](https://kb.vmware.com/)
- [VMware Compatibility Guide](https://www.vmware.com/resources/compatibility/)
- [VMware Hands-on Labs](https://www.vmware.com/try-vmware/hands-on-labs.html)
- [vExpert Community](https://vexpert.vmware.com/)
- [VMTN (VMware Technology Network)](https://communities.vmware.com/)

## Related

- [[proxmox]]
- [[linux-networking]]
- [[cli-tricks]]
- [[hardware-inventory]]
