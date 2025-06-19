# Usa la imagen oficial de Node.js LTS (long-term support) en su versión slim
FROM node:lts-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json (o yarn.lock) para instalar dependencias
COPY package*.json ./

# Instala las dependencias de Node.js.
# Usamos --silent para reducir la verbosidad.
# Instala node-oracledb primero para asegurar que se compilen correctamente las dependencias nativas
# RUN npm install --silent

# Mejorar esta parte: Instalar dependencias del sistema para Oracle Instant Client
# 'lts-slim' es una imagen basada en Debian. 'apt-get' es el gestor de paquetes.
# libaio1 es CRUCIAL para el Instant Client de Oracle en Linux.
# libnsl y libstdc++6 también son dependencias comunes.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    unzip \
    libaio1 \
    libnsl-dev \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

# Crear directorios para el Instant Client y la Wallet
RUN mkdir -p /opt/oracle/instantclient
RUN mkdir -p /opt/oracle/wallet

# Copia los archivos comprimidos del Instant Client al contenedor
# Asume que están en una carpeta 'oracle-instantclient' al mismo nivel que tu Dockerfile
COPY oracle-instantclient/instantclient-basic-linux.x64-21.18.0.0.0dbru.zip /tmp/
COPY oracle-instantclient/instantclient-sdk-linux.x64-21.18.0.0.0dbru.zip /tmp/

# Descomprime el Instant Client en /opt/oracle/instantclient
# NOTA: La carpeta descomprimida será 'instantclient_21_18' dentro de /opt/oracle.
# Luego, creamos un symlink de 'instantclient' que apunta a 'instantclient_21_18'
RUN unzip -o /tmp/instantclient-basic-linux.x64-21.18.0.0.0dbru.zip -d /opt/oracle/instantclient && \
    unzip -o /tmp/instantclient-sdk-linux.x64-21.18.0.0.0dbru.zip -d /opt/oracle/instantclient && \
    rm /tmp/instantclient-basic-linux.x64-21.18.0.0.0dbru.zip /tmp/instantclient-sdk-linux.x64-21.18.0.0.0dbru.zip && \
    ln -s /opt/oracle/instantclient/instantclient_21_18 /opt/oracle/instantclient/current_version && \
    chmod -R 755 /opt/oracle/instantclient/instantclient_21_18 # Asegura permisos de ejecución/lectura

# Copia la wallet al directorio correcto
# Asume que la wallet está en una carpeta 'wallet/Wallet_CGTEST' al mismo nivel que tu Dockerfile
COPY wallet/Wallet_CGTEST /opt/oracle/wallet/Wallet_CGTEST

# Configura las variables de entorno para Oracle Instant Client
# LD_LIBRARY_PATH DEBE apuntar al directorio donde están las librerías .so
ENV LD_LIBRARY_PATH="/opt/oracle/instantclient/instantclient_21_18:${LD_LIBRARY_PATH}"
# Opcional: añade el Instant Client al PATH
ENV PATH="/opt/oracle/instantclient/instantclient_21_18:${PATH}"

ENV TNS_ADMIN="/opt/oracle/wallet/Wallet_CGTEST"

# Copia el resto de los archivos de tu aplicación
COPY . .

# Instala las dependencias de Node.js (ahora que las librerías de Oracle están presentes)
RUN npm install --silent

# Construye la aplicación NestJS
RUN npm run build

# Comando para ejecutar la aplicación cuando el contenedor se inicie
CMD [ "node", "dist/main" ]