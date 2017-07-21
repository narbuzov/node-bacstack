FROM node

# Install dependencies
RUN apt-get update && apt-get install build-essential -y

# Install bacnet-stack
# ADD https://downloads.sourceforge.net/project/bacnet/bacnet-stack/bacnet-stack-0.8.4/bacnet-stack-0.8.4.tgz?r=https%3A%2F%2Fsourceforge.net%2Fprojects%2Fbacnet%2Ffiles%2Fbacnet-tools%2F&ts=1500585404&use_mirror=netix /
ADD ./bacnet-stack-0.8.4.tgz .
# RUN tar -xzf bacnet-stack-0.8.4.tgz
RUN cd bacnet-stack-0.8.4 && make clean all

# Add node-bacstack
Add . .
RUN npm install

# Run stuff
CMD npm run compliance
