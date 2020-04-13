Netflix-Steroids WebExtension
=============================
WebExtension (tested only in Firefox, until now) to add a link to the movie/tv show on the Netflix web app.

### Install
You have two ways to install the extension:
#### Option 1 (recommended)
Install it directly from Mozilla Add-ons web site https://addons.mozilla.org/en-US/firefox/addon/netflix-steroids/
#### Option 2
Or you can download the .xpi file from [here](https://github.com/jpchavat/netflix-steroids/blob/master/web-ext-artifacts/netflix_steroids-0.1-an%2Bfx.xpi).

### How it works ?
The code is totally open, you can seek on it.

#### Short summary
First, the extension extracts the title and year of the movie from the Netflix app. With the title, the extension requests a search in the IMDB web site and extracts from the response the IMDb-Id. That's made because, no matters the title language, the IMDb website returns a unique id. With the IMDb-id, the extension request a video key to TMDb. Finally, a link tag is added in the Netflix web app directed to the youtube video (the trailer). Yes, as dirty as practical!

☼ Feel free to use ☼


I prefer mate, by anyway...

[![Buy me a coffe](https://image.ibb.co/jMMG2x/Buy_Me_ACoffee_general.jpg)](https://www.buymeacoffee.com/jpcoffee)
