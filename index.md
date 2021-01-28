---
layout: default
title: Cameron Fleming
subheading: Hey, I'm Cameron, a Computer Networks Student<br />currently living in Lancashire, United Kingdom.
---

As well as networking, I also enjoy writing rather-bodgy software, you can find these on my 
[GitHub](https://github.com/nevexo) and [GitLab](https://gitlab.com/nevexo).


You can also view a list of my active/retired projects on my [projects page.](/projects)

## Networks
DN42: [AS4242421690](/networks/dn42)

Internet: One day, one day.

## Get in Touch

Twitter: [@\_Nevexo\_](https://twitter.com/_nevexo_)

Email: [cameron@nevexo.space](mailto:cameron@nevexo.space)

Discord: Nevexo#7244

Telegram: [@Nevexo](https://t.me/nevexo)

LinkedIn: [Cameron Fleming](https://linkedin.com/in/nevexo)

[Keys n' Things](/encryption)

## Blog Posts
Not a clue why I decided to add a blog, but here's a list of my posts:<br/>

{% for post in site.posts %}

{{ post.date | date_to_long_string }} - <a href="{{ post.url }}">{{ post.title }}</a>

{% endfor %}

<p class="footer">Built using Jekyll, <a href="https://github.com/nevexo/nevexo.space">view the source.</a></p>