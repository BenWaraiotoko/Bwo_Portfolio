---
title: Proxmox VE (Virtual Environment)
date: 2025-12-28
description: Proxmox VE open-source virtualization platform guide
tags:
  - virtualization
  - proxmox
  - homelab
  - hypervisor
  - kvm
  - lxc
category: second-brain
publish: true
---
## Summary

Proxmox VE is an open-source virtualization platform that combines KVM hypervisor and LXC containers with a web-based management interface. It's ideal for homelab environments, providing enterprise-grade features without licensing costs.

## Key concepts

- **KVM (Kernel-based Virtual Machine)**: Full virtualization for running complete operating systems
- **LXC (Linux Containers)**: Lightweight OS-level virtualization for Linux systems
- **ZFS/LVM storage**: Advanced storage management with snapshots and replication
- **High Availability (HA)**: Automatic VM failover in cluster configurations
- **Backup and restore**: Built-in backup solutions with Proxmox Backup Server
- **Clustering**: Multiple Proxmox nodes working as a single system

## Details

### Installation and initial setup

**System requirements:**
- 64-bit CPU with virtualization extensions (Intel VT-x or AMD-V)
- Minimum 2GB RAM (8GB+ recommended)
- Storage for host OS and VM/container data
- Network interface(s)

**Installation:**
```bash
# Download ISO from proxmox.com/downloads
# Boot from ISO and follow installer
# Access web interface: https://proxmox-ip:8006
```

**Post-installation:**
```bash
# Update system
apt update && apt full-upgrade

# Remove enterprise repository (if not subscribed)
rm /etc/apt/sources.list.d/pve-enterprise.list

# Add no-subscription repository
echo "deb http://download.proxmox.com/debian/pve bookworm pve-no-subscription" > /etc/apt/sources.list.d/pve-no-subscription.list

# Update again
apt update
```

### Web interface management

**Access points:**
- Web UI: `https://proxmox-ip:8006`
- Default credentials: `root` with installation password
- Shell access via web terminal or SSH

**Navigation:**
- Datacenter → Cluster-wide settings and overview
- Node → Individual server management
- VM/CT → Virtual machine or container management

### Virtual machine management

**Creating VMs via CLI:**
```bash
# Create VM
qm create 100 --name ubuntu-vm --memory 2048 --cores 2 --net0 virtio,bridge=vmbr0

# Import disk image
qm importdisk 100 ubuntu-22.04.qcow2 local-lvm

# Attach disk to VM
qm set 100 --scsi0 local-lvm:vm-100-disk-0

# Set boot order
qm set 100 --boot order=scsi0

# Start VM
qm start 100

# Stop VM
qm stop 100

# List all VMs
qm list

# Show VM config
qm config 100

# Delete VM
qm destroy 100
```

**VM operations:**
```bash
# Clone VM
qm clone 100 101 --name cloned-vm

# Create snapshot
qm snapshot 100 pre-update

# Rollback snapshot
qm rollback 100 pre-update

# Delete snapshot
qm delsnapshot 100 pre-update

# Migrate VM to another node
qm migrate 100 node2

# Resize disk
qm resize 100 scsi0 +10G
```

### Container (LXC) management

**Creating containers:**
```bash
# Download container template
pveam update
pveam available
pveam download local ubuntu-22.04-standard_22.04-1_amd64.tar.zst

# Create container
pct create 200 local:vztmpl/ubuntu-22.04-standard_22.04-1_amd64.tar.zst \
  --hostname web-server \
  --memory 1024 \
  --cores 2 \
  --net0 name=eth0,bridge=vmbr0,ip=dhcp

# Start container
pct start 200

# Enter container
pct enter 200

# List containers
pct list

# Stop container
pct stop 200

# Delete container
pct destroy 200
```

**Container operations:**
```bash
# Create snapshot
pct snapshot 200 backup-point

# Restore snapshot
pct rollback 200 backup-point

# Clone container
pct clone 200 201 --hostname cloned-container

# Resize container disk
pct resize 200 rootfs +5G

# Execute command in container
pct exec 200 -- apt update
```

### Storage management

**Storage types:**
- **Directory**: Simple directory-based storage
- **LVM**: Logical Volume Manager
- **LVM-thin**: Thin provisioned LVM
- **ZFS**: Advanced filesystem with snapshots and compression
- **NFS**: Network File System
- **CIFS/SMB**: Windows file shares
- **iSCSI**: Block-level storage over network

**Storage commands:**
```bash
# List storage
pvesm status

# Add NFS storage
pvesm add nfs nfs-storage --server 192.168.1.10 --export /mnt/nfs

# Add directory storage
pvesm add dir backup-storage --path /mnt/backups

# Scan storage
pvesm scan nfs 192.168.1.10

# Remove storage
pvesm remove storage-name
```

**ZFS management:**
```bash
# Create ZFS pool
zpool create tank /dev/sdb

# List pools
zpool list

# Check pool status
zpool status

# Create dataset
zfs create tank/vms

# Enable compression
zfs set compression=lz4 tank/vms

# Create snapshot
zfs snapshot tank/vms@backup1

# List snapshots
zfs list -t snapshot
```

### Networking

**Network configuration:**
```bash
# Edit network config
nano /etc/network/interfaces

# Apply network changes
ifreload -a

# View network config
cat /etc/network/interfaces
```

**Bridge configuration example:**
```
auto vmbr0
iface vmbr0 inet static
    address 192.168.1.10/24
    gateway 192.168.1.1
    bridge-ports enp1s0
    bridge-stp off
    bridge-fd 0

# VLAN-aware bridge
auto vmbr1
iface vmbr1 inet manual
    bridge-ports enp2s0
    bridge-stp off
    bridge-fd 0
    bridge-vlan-aware yes
    bridge-vids 2-4094
```

**Firewall management:**
```bash
# Enable firewall
pvesh set /cluster/firewall/options --enable 1

# Configure via web UI: Datacenter → Firewall
# Or edit files: /etc/pve/firewall/
```

### Backup and restore

**Backup commands:**
```bash
# Backup VM
vzdump 100 --compress zstd --mode snapshot --storage backup-storage

# Backup all VMs
vzdump --all --compress zstd --mode snapshot --storage backup-storage

# List backups
ls -lh /var/lib/vz/dump/

# Restore from backup
qmrestore /var/lib/vz/dump/vzdump-qemu-100-*.vma.zst 100

# Delete old backups (keep last 3)
vzdump 100 --remove 1 --maxfiles 3
```

**Backup modes:**
- **snapshot**: Live backup using VM snapshots (best for most cases)
- **suspend**: Suspend VM, backup, resume
- **stop**: Stop VM, backup, restart

### Clustering

**Create cluster:**
```bash
# On first node
pvecm create cluster-name

# Get join information
pvecm status

# On additional nodes
pvecm add 192.168.1.10

# View cluster status
pvecm nodes
pvecm status

# Remove node from cluster
pvecm delnode node-name
```

**Cluster features:**
- Shared configuration across nodes
- Live migration of VMs between nodes
- High availability (automatic failover)
- Distributed storage with Ceph

### High Availability (HA)

**Enable HA:**
```bash
# Add VM to HA group (via web UI or CLI)
ha-manager add vm:100

# Set HA parameters
ha-manager set vm:100 --state started --group ha-group1

# View HA status
ha-manager status

# Remove from HA
ha-manager remove vm:100
```

### Command-line tools reference

**System:**
```bash
pveversion                        # Show Proxmox version
pvesh                            # Proxmox VE Shell (API access)
journalctl -u pve*               # View Proxmox logs
systemctl status pve*            # Check Proxmox services
```

**Monitoring:**
```bash
pvesh get /nodes/nodename/status  # Node status
pvesh get /cluster/resources      # Cluster resources
top                               # System resources
htop                              # Interactive process viewer
```

## Examples

**Quick VM deployment:**
```bash
# Download cloud image
wget https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img

# Create VM
qm create 100 --name ubuntu-cloud --memory 2048 --cores 2 --net0 virtio,bridge=vmbr0

# Import and attach disk
qm importdisk 100 jammy-server-cloudimg-amd64.img local-lvm
qm set 100 --scsi0 local-lvm:vm-100-disk-0 --boot order=scsi0

# Add cloud-init
qm set 100 --ide2 local-lvm:cloudinit
qm set 100 --serial0 socket --vga serial0
qm set 100 --ipconfig0 ip=dhcp

# Start VM
qm start 100
```

**Automated backup script:**
```bash
#!/bin/bash
# Backup all VMs with zstd compression
vzdump --all --compress zstd --mode snapshot --storage backup-storage --remove 1 --maxfiles 7
```

**VM template creation:**
```bash
# Create and configure VM
qm create 9000 --name template --memory 2048 --cores 2

# Convert to template
qm template 9000

# Clone from template
qm clone 9000 100 --name new-vm --full
```

**Bulk container creation:**
```bash
#!/bin/bash
for i in {1..5}; do
  pct create $((200+i)) local:vztmpl/ubuntu-22.04-standard.tar.zst \
    --hostname web-$i \
    --memory 1024 \
    --cores 1 \
    --net0 name=eth0,bridge=vmbr0,ip=dhcp
  pct start $((200+i))
done
```

## Resources

- [Proxmox VE Documentation](https://pve.proxmox.com/pve-docs/)
- [Proxmox VE Wiki](https://pve.proxmox.com/wiki/Main_Page)
- [Proxmox Community Forum](https://forum.proxmox.com/)
- [Proxmox VE on Reddit](https://www.reddit.com/r/Proxmox/)
- [Learn Linux TV - Proxmox Tutorials](https://www.learnlinux.tv/tag/proxmox/)
- [TechnoTim - Proxmox Guides](https://technotim.live/tags/proxmox/)
- [Proxmox Helper Scripts](https://tteck.github.io/Proxmox/)

## Related

- [[vsphere]]
- [[linux-networking]]
- [[cli-tricks]]
- [[hardware-inventory]]
- [[install-jupyterlab-vm]]
- [[fixing-immich-installation]]
- [[de-project-1-1-hello-docker]]
