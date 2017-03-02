FROM nodesource/jessie:argon

LABEL name="spawn-docker-example"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN useradd --home /home/node -m -U -s /bin/bash node

RUN echo 'Defaults !requiretty' >> /etc/sudoers; \
    echo 'node ALL= NOPASSWD: /usr/sbin/dpkg-reconfigure -f noninteractive tzdata, /usr/bin/tee /etc/timezone, /bin/chown -R node\:node /myapp' >> /etc/sudoers;

USER node

RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
ENV NODE_VERSION 6.9.1

ENV NVM_DIR /home/node/.nvm

ADD ./init.sh init.sh
ADD ./index.js index.js
ADD ./empty.js empty.js

RUN . ~/.nvm/nvm.sh && nvm install v6 && nvm use v6

USER root
RUN . /home/node/.nvm/nvm.sh && npm install browserify through
USER node
