---
title: "The Next episode/update"
date: "2026-09-27"
excerpt: "Still alive, still no schedule; but we got plans, oh so many plans!"
tags: ["personal", "update"]
status: "published"
---

## Still Alive, Still No Schedule

So it's been a little while, huh? To be honest, it's not like I ever actually promised timeliness out of my updates, just that they would eventually show up; so you get what you (didn't) pay for here. Probably a smart move on my part not to promise anything, seeing as I would've broken it by post 1... With that out of the way, welcome to my second update. We have a good bit to catch up on: tons of side quests were taken, a lot of progress was made on things I didn't even know needed it, and I actually formed a sort of plan for going forward. "Sort of" is going to do a lot of heavy lifting here, so buckle in, be prepared to get no real answers out of me, and let's dive into the catch-up on what I've done but never wrote about, some of those future plans, a bit about my AI use and what it means here, and then a graceful exit to set you up for disappointment in my not-so-planned next post.

### An update on the things done and barely tracked

#### First project cards live!

The first few project cards are live and on the site! Not too much meat behind them yet, but a few of the projects I've actually been making progress on made it there. I expect I'll keep updating those cards on a semi-random basis, maybe eventually adding more detail to them overall. Right now, the biggest thing missing is anything for the visual readers out there, but I promise I'll at least try to sit down and grab some screenshots at some point... maybe? Feel free to click through to the 4 live ones now on [the projects page](/projects).

#### Electron apps chugging along

The first major projects I worked on were Electron-based, since that's basically what the internet told me to do when I said I wanted a desktop application. [Anvil](/projects/anvil) is a quintessential side-quest project born out of my early work on [Aether Gears](/projects/aether-gears), and is meant as a replacement for the regular spreadsheet-upon-spreadsheet approach to data management when making an RPG. It has some neat little goals of eventually exporting game-ready dictionaries that you can drop straight into your game engine and read by script, or maybe even a future also-side-quest engine tool. [COG](/projects/cog) was the first 'real' thing I worked on, though, and it was my way of diving into "how much can I track and pretend I'm saving money on my LLM subscription?" More on where both of these actually stand in a bit.

Both apps run Electron mostly because I'm a mechanical guy just jumping into this app development game who really didn't know where to start, so I found the most common thing and went with it. The goal here was never to make something wildly successful; just get it working and see how it all plays out. Whether I stick with Electron long term is... well, keep reading.

#### Branching into Flutter

Building on the "I'm here to learn, baby" aesthetic, I also started some work on some super secret Flutter projects. But really only secret because I don't actually have a card up for them yet. I chose to dive into Flutter mostly for the Android support and the Java-like environment; honestly, I like it a bit more and it's easier for me to follow, since my limited background is mostly Java-based and the TypeScript/React work in Electron wasn't really doing it for me. As for why I suddenly care about mobile at all? That'll become extremely clear in a minute.

#### Software? From this guy?

So, dear reader, you MUST be wondering - why is this mechanical engineer playing software dev wannabe?? Where are all the cool mechanical/hardware things I truly signed up for?? Well, technically there's nowhere to sign up for anything, so we're both off the hook there. Secondly, don't you worry , that stuff is on the way and in the works. It just takes way, way more dedication to get something detailed and coherent up on that front than it does to push a software project forward, especially considering how useful AI in general has been (a bit more on that vibe later). The 3D printer never stops churning things out; I just need to get my brain to catch up and get some of the words down for you all to feast on. What that actually looks like is waiting for you down in the plans.

### Back to the future

#### First app store release?

First thing up - finishing a good ole wife request. This one falls squarely into the TTKMWFBPAM category of projects, that's the ["trying to keep my wife from being pissed at me"](/blog/001-intro-to-me) project line, for anyone just joining us, even though it isn't strictly CAD or for the house itself. She drove the initial requirements; I just took that ask and ran with it. Essentially, it's a glorified, niche note-taking app specifically for... cheese tasting! She got the idea when we did a weekend date to go learn about cheeses, and essentially asked me to make it for her. I took that and thought... how can I possibly make this even harder for myself? And voilà, the idea of a true, first actual app store release came to be. The driver behind putting it in the app store was that I didn't want to maintain her phone for her: if I could get an app that installs and updates just like any other app instead of relying on sideloading, I'd be in business. This also semi-drove the change to Flutter, since this is my first mobile-first project, and since I'm an Android guy through and through, Flutter felt like the way to go for me.

So far, I've got some v0.1.0 release candidates for Cheesy Scribe (be on the lookout for a project page soon-ish), and through the power of internal testing groups I have the main "app store easy install and update" line done! I do want to take it the full distance, though, and eventually get it fully into production and in the hands of anyone; more a personal milestone than anything, in reality. So be on the lookout for that, and hopefully I figure out how to convince 12 of my closest friends, who also use Android, to consistently test and help me cross that hurdle to a production release. And hey, if you want to be one of those friends, drop me a line on [the contact page](/contact)!

#### Anvil and COG - proper release status when?

This one is kind of a twofer; I'm looking to both define what "released" means to me and figure out what I need to do for both of these projects to get them there. In reality, both are usable and do the primary thing behind each.

COG tracks my usage, puts it in a local SQLite DB for saving, has export options to move that data around, and "works" across both Windows and Linux; it's even branched into a proper major release that's getting tested on Linux right now (by myself, but hey, you can try it too! If you use Claude, at least...). Essentially, it's doing what I want it to; it's some of that final polish that I still want to finish up. And it takes me long enough that I get a new model released on me before I'm ready, or find something else has changed and broken what worked (chat data importing changing from a single file to a large, nested structure is going to be fun...). To me, that means it still has a tiny bit of polish to go, but then it needs to shift to "maintenance," where I come back every few weeks or months (if we are being realistic here) to update for new models and any other changes in the fast-paced world of chatbots and subscriber-based LLMs.

Anvil lets me manage the barebones of what I need out of an RPG data management system. Not everything is well formula-backed, the default exports still need some final tweaks (but you can always customize the export, so this gets called "done enough"), and you can even easily manage multiple projects at once. Like COG, there's still polish needed, I think; but the bigger thing for Anvil is that I need some other sort of feedback, and in my limited space I just really don't know where to get it from.

So: both projects, easily on the cusp of being done, but not done enough for what I want out of them. And that really means I need a better, solid definition of "done" so I can release and move on. Hopefully my app store release teaches me a bit about what I want on that front, so this set of work also lands in the "future me" problem bucket; be sure to look out for a post detailing, at least somewhat, what I end up deciding here.

Also, as always, if either one of these projects seems like something you'd be interested in stumbling through, just drop me a line on [the contact page](/contact) or feel free to visit the [Anvil](https://github.com/tkforgeworks/anvil/releases) and [COG](https://github.com/tkforgeworks/claude-observability-gui/releases) GitHub repos, the releases are all there. You can drop an issue in GitHub, or email me, and maybe I'll make a few Jira forms to help keep track when the millions of requests start coming in...

#### Bringing back an old flame

And finally, in the "I'm actually, currently, right now thinking about what to do next" section of the plan; bringing myself back to my roots of mechanical design. Part of the core thought behind the entire naming of this site/brand/foray is that I have a deep love and passion for mechanical design. I'm a pretty big Formula 1 fan and will watch and follow pretty much anything that requires that high level of design work. And I have the perfect, dusty old project sitting in the wings just waiting for its chance to shine, the same one I hand-waved at back in [my intro post](/blog/001-intro-to-me).

The problem is, it really takes a lot to sit down and work on it. Most of my other projects I can think about on and off; toss up Jira tickets to myself to track crazy ideas, new features, or quick little bugs I find when playing around with them. They're all software, and dev moves faaaaast. But this design? Sitting down and working out the form/fit/function of a part, CADing it up, deciding I want to tweak something by 1mm and now the whole model breaks - all of that takes some serious, dedicated focus time.

So that's what I need to do, and that's what I plan to do. I want to get everything I have cleaned up and better organized, get the assemblies where I want them, and really start capturing what I'm actually doing with the whole idea; so I can get a nice project card up and a couple thousand words going over a project that's been living in my head for the past 6 or 7 years. I'll dig up some of my older CAD to round everything out, too. Be on the lookout for THAT article. ...And now I'm just realizing I'm promising way too much writing and posting from a guy who's only just now got his second blog post up.

### The water-sucking elephant in the room

Ok, time for a bit more seriousness than normal. AI use is rampant, and AI slop is a thing. I'm not helping on either front, because every project above, and even this website itself, has used, or will use, AI extensively to build and maintain where it's all at. I do not have the single-man gusto or skills to be able to do what I have done without the help of AI, specifically Anthropic's Claude. And this carries over from Claude chat when I'm feeling out a new project idea, to Claude Cowork when I want to work on some file organization or email routing, and especially Claude Code when I'm actually working on a project. Hell, I even took massive advantage of Claude's design tooling to work on the base design system for this website. I am not a UI/UX person, and I'm not a hands-on code monkey who can churn out anything they want in a weekend; the best I've realistically done solo is a pretty complicated microservices school project.

I do want to spend some time writing up my experiences, how I've used AI in my projects, and all the details I know everyone wants, but this isn't the place. That really deserves its own series of posts, so I'll be working on that, and consistent with this blog's editorial policy, it will arrive somewhere between soon and eventually.

But the biggest thing I wanted to get out there is simple: yes, I use AI, extensively, in everything you see here, and that isn't changing anytime soon. That may or may not always be the case, especially with the mechanical projects, but it will always play some role, at least as my sounding board or my grammar checker, so it's simply not going away. I strive to be as far away from "slop" as possible, and I really try to take the time to review and shepherd it all toward what I actually have up in my head, but I can't promise more than what one man can offer. And I'll probably always struggle with whether what I have here is really "mine" (I don't know if I'll ever be able to answer that one) but I'm never going to be one to pretend it's "all me" when it's an untold number of GPUs helping me from the cloud to get this all done.

### Closer

And that's all, folks; thanks for tuning in to another perfectly timed blog update. I appreciate all 1 of you, besides me, that maybe reads this from time to time, and I'm really hoping to maybe see that number go up to 2 by the next time I post. When is that next post? Who knows, really. All I can say is it will show up at some point, so please, come back as often as possible so you don't miss it!

