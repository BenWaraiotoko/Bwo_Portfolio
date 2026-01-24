---
title: Linux Networking
date: 2025-12-28
description: Linux networking fundamentals covering configuration, troubleshooting, and monitoring
tags:
  - linux
  - networking
  - sysadmin
  - homelab
category: second-brain
publish: true
---
## Summary

Linux networking fundamentals covering network configuration, troubleshooting, monitoring, and essential tools. Critical knowledge for system administration, homelab management, and understanding how systems communicate.

## Key concepts

- **IP addressing**: IPv4/IPv6 addresses, subnets, CIDR notation
- **Network interfaces**: Physical and virtual network adapters
- **Routing**: How packets travel between networks
- **DNS**: Domain name resolution and configuration
- **Ports and services**: Network services listening on specific ports
- **Firewalls**: Controlling network traffic with iptables/firewalld/ufw

## Details

### Network interfaces

**Viewing interfaces:**
```bash
ip addr show                      # Show all interfaces (modern)
ip link show                      # Show interface status
ifconfig                          # Legacy command (deprecated)
nmcli device status               # NetworkManager status
```

**Managing interfaces:**
```bash
ip link set eth0 up               # Enable interface
ip link set eth0 down             # Disable interface
ip addr add 192.168.1.100/24 dev eth0  # Add IP address
ip addr del 192.168.1.100/24 dev eth0  # Remove IP address
```

**Interface configuration files:**
- **Debian/Ubuntu**: `/etc/network/interfaces` or `/etc/netplan/*.yaml`
- **RHEL/CentOS**: `/etc/sysconfig/network-scripts/ifcfg-*`
- **systemd-networkd**: `/etc/systemd/network/*.network`

### IP addressing and subnets

**Understanding CIDR notation:**
```
192.168.1.0/24    # 256 addresses (192.168.1.0 - 192.168.1.255)
192.168.1.0/25    # 128 addresses
192.168.1.0/26    # 64 addresses
10.0.0.0/8        # 16,777,216 addresses (entire Class A)
172.16.0.0/12     # 1,048,576 addresses (Class B private)
```

**Private IP ranges (RFC 1918):**
- `10.0.0.0/8` (10.0.0.0 - 10.255.255.255)
- `172.16.0.0/12` (172.16.0.0 - 172.31.255.255)
- `192.168.0.0/16` (192.168.0.0 - 192.168.255.255)

**Special addresses:**
- `127.0.0.1` - Loopback (localhost)
- `0.0.0.0` - Any/all addresses
- `255.255.255.255` - Broadcast

### Routing

**View routing table:**
```bash
ip route show                     # Show routing table (modern)
route -n                          # Legacy command
netstat -rn                       # Alternative view
```

**Manage routes:**
```bash
ip route add 192.168.2.0/24 via 192.168.1.1  # Add route
ip route del 192.168.2.0/24                  # Delete route
ip route add default via 192.168.1.1         # Set default gateway
```

**Traceroute:**
```bash
traceroute google.com             # Trace packet path
tracepath google.com              # Alternative (no root needed)
mtr google.com                    # Continuous traceroute
```

### DNS configuration

**DNS lookup tools:**
```bash
nslookup google.com               # Basic DNS lookup
dig google.com                    # Detailed DNS query
dig @8.8.8.8 google.com          # Query specific DNS server
dig google.com +short             # Brief output
host google.com                   # Simple DNS lookup
```

**DNS configuration files:**
```bash
/etc/resolv.conf                  # DNS resolver configuration
/etc/hosts                        # Local hostname mapping
/etc/nsswitch.conf               # Name service switch
```

**Example /etc/resolv.conf:**
```
nameserver 8.8.8.8
nameserver 8.8.4.4
search local.domain
```

### Network testing and diagnostics

**Connectivity testing:**
```bash
ping -c 4 google.com              # Send 4 ICMP echo requests
ping -i 0.2 192.168.1.1          # Ping every 0.2 seconds
ping6 google.com                  # Ping IPv6

nc -zv google.com 80              # Test if port is open (netcat)
telnet google.com 80              # Test port connectivity
```

**Network statistics:**
```bash
netstat -tuln                     # Active listening ports (legacy)
ss -tuln                          # Socket statistics (modern)
ss -tunlp                         # Include process information
ss -s                             # Summary statistics

netstat -i                        # Interface statistics
ip -s link                        # Interface stats (modern)
```

**Active connections:**
```bash
ss -tunap                         # All TCP/UDP connections
netstat -anp                      # All connections with PIDs
lsof -i                          # List open network files
lsof -i :80                      # Processes using port 80
```

### Network monitoring

**Bandwidth monitoring:**
```bash
iftop                             # Real-time bandwidth usage per connection
iftop -i eth0                     # Monitor specific interface
nethogs                           # Bandwidth by process
nload                             # Simple bandwidth monitor
vnstat                            # Network traffic logger
bmon                              # Bandwidth monitor with graphs
```

**Packet capture:**
```bash
tcpdump -i eth0                   # Capture packets on interface
tcpdump -i eth0 port 80           # Capture only port 80
tcpdump -i eth0 -w capture.pcap   # Save to file
tcpdump -r capture.pcap           # Read from file
tcpdump -i eth0 host 192.168.1.1  # Capture specific host

wireshark                         # GUI packet analyzer
tshark -i eth0                    # Wireshark CLI
```

### Firewall management

**iptables (traditional):**
```bash
iptables -L                       # List rules
iptables -L -n -v                 # Verbose numeric output
iptables -A INPUT -p tcp --dport 22 -j ACCEPT  # Allow SSH
iptables -A INPUT -s 192.168.1.0/24 -j ACCEPT  # Allow subnet
iptables -P INPUT DROP            # Default deny
iptables-save > /etc/iptables/rules.v4  # Save rules
```

**firewalld (RHEL/CentOS):**
```bash
firewall-cmd --state              # Check firewall status
firewall-cmd --list-all           # List all rules
firewall-cmd --add-service=http   # Allow HTTP temporarily
firewall-cmd --add-service=http --permanent  # Permanent rule
firewall-cmd --reload             # Reload configuration
firewall-cmd --list-ports         # List open ports
```

**ufw (Ubuntu):**
```bash
ufw status                        # Check firewall status
ufw enable                        # Enable firewall
ufw allow 22/tcp                  # Allow SSH
ufw allow from 192.168.1.0/24     # Allow subnet
ufw deny 80/tcp                   # Block HTTP
ufw delete allow 80               # Remove rule
```

### Network services

**systemd-networkd:**
```bash
systemctl status systemd-networkd
networkctl status                 # Network status
networkctl list                   # List interfaces
```

**NetworkManager:**
```bash
nmcli general status              # Overall status
nmcli device status               # Device status
nmcli connection show             # Show connections
nmcli connection up "Wired 1"     # Activate connection
nmcli device wifi list            # List WiFi networks
nmcli device wifi connect SSID password PASSWORD
```

**systemd-resolved (DNS):**
```bash
systemctl status systemd-resolved
resolvectl status                 # DNS status
resolvectl query google.com       # Query DNS
```

### Network configuration

**Static IP (netplan - Ubuntu 18.04+):**
```yaml
# /etc/netplan/01-netcfg.yaml
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: no
      addresses: [192.168.1.100/24]
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
```

**Apply netplan:**
```bash
netplan try                       # Test configuration
netplan apply                     # Apply configuration
```

## Examples

**Find which process is using a port:**
```bash
lsof -i :8080
# or
ss -tunlp | grep :8080
```

**Test network speed between two hosts:**
```bash
# On server:
iperf3 -s

# On client:
iperf3 -c server_ip
```

**Scan network for active hosts:**
```bash
nmap -sn 192.168.1.0/24          # Ping scan
nmap -p 22,80,443 192.168.1.0/24 # Port scan
```

**Monitor DNS queries:**
```bash
tcpdump -i any -n port 53
```

**Check if service is accessible:**
```bash
curl -I http://example.com        # Check HTTP
curl -v telnet://example.com:22   # Check SSH port
```

**Find your public IP:**
```bash
curl ifconfig.me
curl ipinfo.io/ip
dig +short myip.opendns.com @resolver1.opendns.com
```

**Test network latency:**
```bash
ping -c 100 8.8.8.8 | tail -1
```

**Flush DNS cache:**
```bash
# systemd-resolved
resolvectl flush-caches

# nscd
systemctl restart nscd

# dnsmasq
systemctl restart dnsmasq
```

**Create port forwarding:**
```bash
# Forward local port 8080 to remote 80
ssh -L 8080:localhost:80 user@remote
```

**Monitor network traffic by IP:**
```bash
tcpdump -n src 192.168.1.100
tcpdump -n dst 192.168.1.100
```

## Resources

- [Linux Network Administrators Guide](https://tldp.org/LDP/nag2/index.html)
- [Red Hat Networking Guide](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/configuring_and_managing_networking/index)
- [Ubuntu Networking Documentation](https://ubuntu.com/server/docs/network-configuration)
- [Netplan Documentation](https://netplan.io/)
- [iptables Tutorial](https://www.frozentux.net/iptables-tutorial/iptables-tutorial.html)
- [Practical Networking](https://www.practicalnetworking.net/)
- [NetworkManager Documentation](https://networkmanager.dev/)

## Related

- [[cli-tricks]]
- [[git]]
- [[proxmox]]
- [[vsphere]]
- [[hardware-inventory]]
- [[install-jupyterlab-vm]]
- [[fixing-immich-installation]]
