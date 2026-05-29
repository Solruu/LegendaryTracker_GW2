# LegendaryTracker_GW2
Legendary tracker to organize and optimize farming for legendaries, in the GW2 game.

This project started with a need to organize the humongous amount of data needed to understand "what to do next" while trying to farm legendaries. The wiki (https://wiki.guildwars2.com/wiki/Main_Page), the already existing sites (gw2efficiency and alike) and all other resources I came across where definitely a huge source of intel on "what is required", but not really on "how to efficiently farm it".
I hope this tracker fulfill this need, by proposing some options to streamline the efforts and efficiently track the player's current state, against one or many legendaries.
It was built with some constraints in mind : The average estimate is 2h worth of effort per farming session, to calculate most of the "efficiency" displayed in the tracker. Meaning for instance that metas have been "chained" based on how easy it would be to get them done, as well as how many would "fit" in a 2h window, to get some farming done (with synergies of zones / ressources and rewards, depending on which legendary is the goal for this session).

This is by no mean a "perfect farming legendary" guide, and any and all improvements shared would most likely help improving this tool.

It uses a mix of "hard coded" recipes, as well as dynamic API calls for tracking purposes, and requires a valid API key from the ANET account (stored on a local file), as well as a Flask server to host the API requests.

This is a work in progress, and the code is AI generated. While I am not trying to get a "good code", I do care about giving the best experience possible for this tracker to be helpful. I do not have the time to code it "by hand" and heavily relied on Claude.ai to generate the code, HTML/jsx UI and python/.exe generators. 
I spent however a lot of time testing and enriching it data-wise.
