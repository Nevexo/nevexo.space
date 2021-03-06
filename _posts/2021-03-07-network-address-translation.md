---
layout: post
title:  "Uni Networking: Network Address Translation"
date:   2021-03-07 12:00:00 +0000
categories: Networking
---

This post covers the 'network address translation' (NAT) system, another *temporary*™ fix for IPv4 exhaustion.


## Part 1: IPv4 Exhaustion?

Internet Protocol (IP) version 4 makes IP addresses out of a 32 bit (4 octets) number. This means we can _only_ have 4,294,967,296 IP addresses.


That seems like a lot sure, but that's only the theroetical max. We have broadcast addresses, gateways, network addresses and 'private addresses'
(more on those later) to deal with.


Now with everything from the computer you're reading this on to the light bulb in my dining room, we're connecting everything to the internet, and thus
~~we're running out~~ we've run out of IPv4 addresses.


The permanent fix for this is IP version 6, which uses 128 bits to represent IP addresses, that gives us about 340,282,366,920,938,463,463,374,607,431,768,211,456 IP addresses.


However, system admins and software developers aren't great at deploying it (I mean, if you thought subnetting on IPv4 was hard, try it with letters.) 
And when I say "aren't great", I [mean it.](https://whynoipv6.com/)

Chances are, your internet service provider don't even support IPv6, [find out here.](http://ipv6-test.com/)


Okay so, we've run out of IPv4 addresses - what can we do about that?

## Part 2: Private IP Address Space

You might've realised many home IP addresses start with `192.168.1.X` - how can that be? Surely overlapping IPs would cause an issue when
the internet is literally a "network of networks."


Well, these IP addresses are classified as 'private' / 'bogon' - meaning they ~~will~~ should never be used on the internet. There's a standard for this
[RFC1918](https://tools.ietf.org/html/rfc1918).


These include

- 192.168.0.0/16
- 172.16.0.0/16
- 10.0.0.0/8

You can use those on an internal network as long as you don't try to route them out to the internet - more firewalls drop any bogon traffic from
the outside, so it won't be possible regardless.


So now your desktop has a private IP address of `192.168.1.2` - but wait, that's not routable to the internet, so how does your computer get on the internet??

## Part 3: Oh, Finally, NAT.

Network address translation allows these private IPs to be translated into one public IP. So the little 'router' that your ISP gave you is holding the public IP address
assigned to your house, to anything else on the internet, this is the only IP you're using. So no matter what device you use on your network, the service
you're accessing sees the IP of your router, not the device you're using it from.


You can see this IP address on my router, assigned to the 'ether10' interface

![A router showing interface IP addresses](https://i.imgur.com/nj1ET7c.png)

All other interfaces are assigned IP address from the RFC1918 'private address space' - these are the networks my devices are connected.

For simplicity, we'll just be looking at my 'Main' network, this is where my phone, desktop, laptop etc are.



When my phone wishes to access Google, for example, it forms a packet with Google's IP (from DNS) as the destination, and it's private IP 
(`172.16.1.126`) as the source. As Google doesn't exist on my private network (who would've guessed?), the packet is kicked off to the default gateway (my router)

| Source       | Destination    | Type             |
|--------------|----------------|------------------|
| 172.16.1.126 | 216.58.212.206 | TCP HTTP Request |

My router checks if it owns Google (nope, still doesn't) so decides it needs to go out to it's default gateway (the one in the little cabinet down the road.)

But wait, that's a private IP, surely TalkTalk are just going to reject that? Well, of course they are. So NAT steps in.

![NAT settings on my MikroTik Router](https://i.imgur.com/qP9BJzf.png)

This is a "masquerade" rule, which is listenong on the "LAN" network and will catch any packet destined for the "WAN" (internet) network. 


NAT will now strip the private IP out of the source header of the packet, and drop the router's public IP back in there. 


| Source        | Destination    | Type             |
|---------------|----------------|------------------|
| 79.75.XXX.XXX | 216.58.212.206 | TCP HTTP Request |

Now this packet can be sent out of the WAN interface down to the internets. Where a handful of other routers will get it to Google for us.


Now, Google is going to respond and send a packet back to us, destined for our public IP address.

| Source         | Destination   | Type              |
|----------------|---------------|-------------------|
| 216.58.212.206 | 79.75.XXX.XXX | TCP HTTP Response |

This packet hits the router and now NAT steps in again, when it sent the packet to Google a little while ago (well, a few milliseconds ago) it logged
this 'connection' into a table called the NAT connection table. 

![TCP/IP Connections Table](https://i.imgur.com/Y4AjoPE.png)

Here's the table currently on my router, it shows two of my devices communicating with other services, each connection has been given a port number.

This is the port that packets are sent back to by the responding server (Google, in this case) so the router knows that this packet belongs to that connection.


NAT will then check the table and find the original source IP, that'll be my phone's private IP of `172.16.1.126` - then it'll swap the destination IP to that
private IP, and send the packet on it's way. The router will send it out of the LAN interface, through the switch, through the wireless access point and finally
it'll land back on my phone with the Google webpage.


There's likely going to be a few packets sent for this session, so NAT will keep the connection alive for a short while, resetting its timer everytime 
a packet is sent via NAT until the timer expires or the connection is closed. 


Done! That's NAT - and the reason that 'port forwarding' exists, but that's a topic for another day, hey, we're not all running Minecraft servers from home.

## Part 4: Pitfalls

> “Nothing is more permanent than a temporary solution."


Yeah, NAT is older than most people that will read this page. It's still heavily relied on, hell, it's easier to configure than 128-bit IP addresses, right?


We've moved on now to CG-NAT, or, Carrier-Grade Network Address Translation. This is where the carrier network (i.e. TalkTalk) run NAT, so instead of every house
having a public IP address, CG-NAT would allow a whole neighbourhood to share a single public IP - come on, deploy IPv6.


Well, regardless, NAT has some issues.


### CPU Usage

It takes CPU power to run NAT, swapping the IPs out of packets for everything destined for the internet isn't nice to the CPU of your router.


This slows down your network. 

### IP Banning

Some services, stupidly, still employ "IP banning" from services. The worst effect on this is a CG-NAT'd network, if Bobby down the street gets IP banned
from [super popular Minecraft server], Sally 3 doors down can't get on to do some hardcore skywars, oh dear.

### Dynamic IP Addresses

Ever noticed that your IP changes randomly? Sometimes when there's a powercut, sometimes for no reason at all? Well that's because of NAT.

ISPs have pools of IP addresses reserved for their customers, you can see the subnets a company owns by looking into BGP. [Here's the ones TalkTalk own.](https://bgp.tools/as/9105#prefixes)



When a DHCP lease with your ISP ends, there's a high chance that IP you just had will be snatched up by another router, somewhere else on their network. So DHCP
will hand your router a new one. 

![DHCP client lease of 15 minutes](https://i.imgur.com/fg77GMo.png)

_Sidenote, TalkTalk DHCP leases only last 15 minutes, awful._


So now you know why your IP changes randomly, why sometimes you're IP banned when your brother is the one that said a naughty word on ROBLOX and how lazy
system administrators can be.


