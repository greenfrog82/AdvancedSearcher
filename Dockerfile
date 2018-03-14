FROM ubuntu:16.04

# To update apt-get and os
RUN apt-get update && apt-get upgrade -y

# To install usefull tools
RUN apt-get install -y \
    vim \
    curl \
    net-tools \
    iputils-ping \
    wget \
	tree

# To install node.js
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y \
	nodejs

# To install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn
	
	

# To install node.js modules globally
RUN npm install -g \
    vue-cli
