FROM node:slim
WORKDIR /app
# install chromium
RUN apt-get update && apt-get install -y libgconf-2-4 gnupg apt-utils curl
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections
RUN apt-get update && apt-get install -yq wget
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN bash -c 'echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' 
RUN apt-get update \
    && apt-get install -yq google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl gnupg apt-utils \
    && rm -rf /src/*.deb

# It's a good idea to use dumb-init to help prevent zombie chrome processes.
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

#ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false

# install node modules
COPY package.json yarn.lock ./
RUN rm -rf node_modules && \
    yarn install --frozen-lockfile && \
    yarn cache clean

# add source code
COPY get_oil.js .

# prepare environment
RUN mkdir -p /app/screenshots

CMD ["node", "./get_oil.js", "--no-sandbox"]