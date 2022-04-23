## puppeteer learning project
- comes with docker for portability
# planned scheduled freewar.de routines
- get oil/gas before storage limit exceeds
- walk routes
- loot items
- drop items
- sell from list matches if 115% shop is available
- sell in market
...
# actual feature list
- login with custom user
    - via env-file with "FW_USER" and "PW"
- get oil (only on the right place)

build the docker image on your own or use the existing image, for example:
```sudo docker run --rm --name fwbot --env-file .env -v "${PWD}"/screenshots:/app/screenshots/ immihendrix/fwbot:mvp```