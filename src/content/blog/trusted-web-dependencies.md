---
title: The Web Is Getting Harder to Trust
author: B. Koop
pubDatetime: 2026-11-18T18:00:00Z
postSlug: trusted-web-dependencies
featured: false
draft: true
tags:
  - Security
  - Web
  - Privacy
description: The D&D Beyond incident shows how one compromised website tool can put visitors at risk across hundreds of familiar sites.
---

When you walk, you trust your feet. When you ride a bike, you trust yourself and that the bike was put together properly. Get in a car and the trust gets bigger. You are trusting the car, the people who built it, the roads, and the rules that keep traffic moving. We learned how to trust those layers over a long time.

The web has layers too. We trust the site in the address bar, but it may also load code from analytics tools, chat widgets, payment providers, ads, and testing platforms. Those tools are useful, but every one adds another company and another piece of code to trust. Cars took generations of standards, testing, and hard lessons to earn that kind of trust. The AI tools now being added to our lives do not have the same long public track record.

That gap showed up on November 16. Malicious JavaScript reached visitors to D&D Beyond and many other websites through Optimizely, a service used to test website designs. This kind of attack feels scary because it uses the trust that is already there. Your browser loads a script because a site you recognize told it to.

## What happened at D&D Beyond

Security researcher Scott Helme at Report URI found 188 infected Optimizely snippets associated with 178 organizations in a sample of 1,611. D&D Beyond was on the list, along with sites in news, finance, retail, technology, and entertainment. The code was added to customer projects in Optimizely’s Experimentation service. Browsers then loaded it as part of scripts those sites already used.

The payload changed during the day. Report URI documented cryptocurrency address replacement, a payment card skimmer, collection of some browser-readable cookies and page screenshots, and attempts to load exploit kits on Apple mobile devices. The researchers also verified that cryptocurrency was stolen during the campaign. We still do not know how many D&D Beyond visitors were affected, whether payment information was captured there, or whether any device was successfully compromised. Those details have not been made public.

Optimizely said someone exploited a vulnerability in its Experimentation product and added malicious JavaScript to some customer projects. The company says it fixed the vulnerability and removed the code. Report URI saw the affected snippets being cleaned up on November 16. At the time of the reports, D&D Beyond and Wizards of the Coast had not published a separate statement. What we know points to a supplier’s service exposing visitors through D&D Beyond pages. It does not show that D&D Beyond’s own systems were breached.

## The trust chain is the attack surface

The uncomfortable part is that visitors did not have to install a strange app or open an obviously suspicious attachment. Their browser did what the website told it to do. The bad code came through a provider the site already trusted.

Websites are made from services that can change independently of the company whose name appears at the top of the page. A marketing script might run on every page. If someone gets access to change that script, many organizations can be affected at once. So the security question is bigger than “is this website safe?” It also includes the vendors it uses, who can change their code, and how quickly anyone catches a bad change.

That is why a supplier incident can feel personal even if the company you visited was not directly broken into. You were still using the site and trusting it to be safe. The technical distinction matters, but customers still deserve a clear explanation of what happened.

## Why this may become more common

I expect we will see more incidents like this over the next few years. That's my best guess, based on how many shared services websites depend on and how quickly one compromised script can reach a lot of people. Microsoft’s 2026 Digital Defense Report describes cybercrime as an interconnected ecosystem, with automation increasing the scale and speed of attacks. It also reports that people and identities remain major entry points.

AI could make some parts of an attack cheaper, like writing convincing messages or changing a lure for different targets. But this incident does not need an AI explanation. Someone got the ability to change code inside a service lots of sites used, and browsers ran it. The risk is already here.

I also think we are going to hear more arguments about who is responsible when this happens. Companies choose their vendors and decide how much code to run in a visitor’s browser. Most visitors cannot inspect that chain or negotiate its security. Government can set basic reporting rules, and companies should limit access, watch for unexpected changes, and tell users what they know. Saying “we are still investigating” is fair. Leaving people to guess is not.

## What users can do

There is no setting that makes every website safe. But a few things can help if an incident happens:

- Install browser and device updates promptly, especially when a security issue involves code running in the browser.
- Use a password manager and unique passwords, and turn on multifactor authentication where available.
- If you entered payment details on an affected site during the exposure window, review your account and card activity and follow the company’s or bank’s guidance.
- Be skeptical of urgent follow-up emails claiming to offer a refund, security check, or account fix. Navigate to the service yourself instead of using the email link.
- Keep backups of important files, since account theft and ransomware often turn a small compromise into a much bigger problem.

For this incident, visitors should follow current updates from D&D Beyond, Optimizely, and their payment provider. Public research confirms malicious code was served from affected scripts, but it does not establish that every visitor had data stolen. That uncertainty is exactly why timely, specific communication matters.

The web is not going to get less connected. That makes it even more important for companies to know what code they are loading, limit who can change it, and catch problems quickly. I think we will see more attacks aimed at the trust between services. I hope we also see companies take those services seriously as part of their own security.

## Sources

- [Report URI’s technical investigation of the Optimizely incident](https://blog.report-uri.com/worlds-largest-brands-infected-with-malware-via-optimizely/)
- [Optimizely’s incident notice](https://status.optimizely.com/incidents/ftw0fh9wx43z)
- [Microsoft Digital Defense Report 2026](https://www.microsoft.com/en-us/corporate-responsibility/topics/cybersecurity/reports/microsoft-digital-defense-report/)
- [The D&D Beyond report that prompted this article](https://dungeonsanddragonsfan.com/dnd-beyond-malware-attack/)
