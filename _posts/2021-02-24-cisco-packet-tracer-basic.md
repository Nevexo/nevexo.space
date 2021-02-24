---
layout: post
title:  "Basic Network build in Cisco Packet Tracer 8"
date:   2021-02-24 16:00:00 +0000
categories: Networking
---

This post, [inspired by Joe](https://github.com/JDPRi), goes through the basic configuration of two subnets and the routers between them in Packet Tracer 8.
While PT 8 may look a little different if you're currently in a 7.X version, it's functionally the same.

## Part 1 - Initial Setup

<iframe width="420" height="315" src="https://www.youtube.com/embed/xlak0T2uUtg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

In this part we're going to create two identical networks, dubbed subnet A and B. First we need to pick a subnet for these to operate with.

I've decided to use the `192.168.1.0/24` subnet and split it in two using a [subnet calculator](https://www.davidc.net/sites/default/subnets/subnets.html).

This gives us two networks: `192.168.1.0/25` and `192.168.1.128/25` - using the subnet mask `255.255.255.128`. 

We'll use the [Cisco 2860 switches](https://www.cisco.com/c/en/us/products/switches/catalyst-2960-x-series-switches/index.html) and two PCs in both networks
and statically assign the PCs with IP addresses in their respective subnets, leaving the first host address for the routers.

| Computer    | IP Address    |
| ----------- | ------------- |
| PC0         | 192.168.1.2   |
| PC1         | 192.168.1.3   |
| PC2         | 192.168.1.130 |
| PC3         | 192.168.1.131 |

## Part 2 - The Routers

<iframe width="420" height="315" src="https://www.youtube.com/embed/J9ABmVq0oE4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

We have two seperate networks, they don't know about each other and are 'airgapped' - meaning there's no possible way packets can pass between them. Now we'll add
two routers (the [Cisco 2620XM](https://www.cisco.com/c/en/us/products/collateral/routers/2600-series-multiservice-platforms/product_data_sheet0900aecd800fa5be.html)).

We'll first add serial modules to both of these routers by powering them down and installing the WIC-2T serial modules, we'll power them back up and add a serial link
between them as well as a copper-straight through (Ethernet cable to you and me) between the routers & switches.

We'll also add some basic settings to these routers, such as a password, message of the day (MOTD), hostnames and disabling DNS lookups.

The network isn't working yet, but we're nolonger airgapped.

Don't forget to `copy running-config startup-config` before closing Packet Tracer.

## Part 3 - Simulation Mode

<iframe width="420" height="315" src="https://www.youtube.com/embed/Nq3HSzb6FQE" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

This video demonstrates the simulation mode, which we'll be using a lot throughout the rest of these videos and in labs.

## Part 4 - Static routes

<iframe width="420" height="315" src="https://www.youtube.com/embed/S1kyx0NAPZ8" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Now we want the network to start working, we're physically connected but the routers are still dropping packets in either direction.

We'll use the `ip route [network] [mask] [next-hop]` command to add routes to the first router. The `shop ip route` command shows the route
has been added to the [routing table](https://en.wikipedia.org/wiki/Routing_table).

Now we'll use simulation mode again to show the packets making it all the way from PC0 to PC2, but being dropped on the way back by R2. 

So we'll add another route to R2 to allow packets to go across both networks fully.

Finally, I'll demonstrate the reason we need `copy running-config startup-config` by powercycling the network. 

Our network is working! 🎉