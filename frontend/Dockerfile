# --- ETAPA 1: BUILD DE LA APLICACIÓN REACT ---
# Usa una imagen base de Node.js LTS (Long Term Support) en su versión "slim"
# Esta es una versión reciente, estable y generalmente más segura para construir tu app React.
FROM node:lts-slim AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de definición de dependencias del proyecto (package.json, package-lock.json)
# Estos están en la raíz de la carpeta 'frontend'
COPY package*.json ./

# Instala las dependencias de la aplicación
# El flag --silent reduce el output verboso
RUN npm install --silent

# Copia el resto del código fuente de la aplicación React
# Esto copiará todo desde la carpeta 'frontend' (incluyendo la carpeta src de React)
COPY . .

# Construye la aplicación React para producción
# Esto creará una carpeta 'build' (o 'dist') con los archivos estáticos listos para ser servidos
# Asegúrate de que tu script "build" en package.json de React funcione correctamente.
RUN npm run build

# --- ETAPA 2: SERVIR LA APLICACIÓN CON NGINX ---
# Usa una imagen de Nginx muy ligera para servir los archivos estáticos
FROM nginx:alpine

# Copia la configuración personalizada de Nginx
# Este archivo nginx.conf DEBE estar dentro de tu carpeta 'frontend'
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos construidos desde la etapa 'builder' al servidor Nginx
# Asegúrate de que '/app/build' sea la ruta donde `npm run build` generó los archivos estáticos
COPY --from=builder /app/dist /usr/share/nginx/html

# Expone el puerto en el que Nginx escuchará (puerto estándar para HTTP)
EXPOSE 80

# El comando por defecto para iniciar Nginx ya está incluido en la imagen base
CMD ["nginx", "-g", "daemon off;"]