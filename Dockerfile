FROM node:lts-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --silent

COPY . .

RUN apt-get update && \
    apt-get install -y --no-install-recommends libaio1 unzip curl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Descarga e instala Oracle Instant Client básico + sdk (ajustá la versión si querés)
RUN curl -o instantclient-basic-linux.x64.zip https://download.oracle.com/otn_software/linux/instantclient/instantclient-basic-linux.x64-21.7.0.0.0.zip && \
    curl -o instantclient-sdk-linux.x64.zip https://download.oracle.com/otn_software/linux/instantclient/instantclient-sdk-linux.x64-21.7.0.0.0.zip && \
    unzip instantclient-basic-linux.x64.zip -d /opt/oracle && \
    unzip instantclient-sdk-linux.x64.zip -d /opt/oracle && \
    rm instantclient-basic-linux.x64.zip instantclient-sdk-linux.x64.zip && \
    ln -s /opt/oracle/instantclient_21_7 /opt/oracle/instantclient

ENV LD_LIBRARY_PATH=/opt/oracle/instantclient
ENV TNS_ADMIN=/opt/oracle/wallet

COPY wallet/Wallet_CGTEST /opt/oracle/wallet

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
