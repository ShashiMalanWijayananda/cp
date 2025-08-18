FROM nginx:alpine

# Environment variables for backend services
ENV BACKEND_HOST=https://backend-ticketing-v1-ewddbygwhxh5atgd.southeastasia-01.azurewebsites.net \
    BACKEND_HOSTNAME=backend-ticketing-v1-ewddbygwhxh5atgd.southeastasia-01.azurewebsites.net \
    CHAT_HOST=https://chat-service-v1-ajh9acfaf4effsf2.southeastasia-01.azurewebsites.net \
    CHAT_HOSTNAME=chat-service-v1-ajh9acfaf4effsf2.southeastasia-01.azurewebsites.net

# Copy application files
COPY dist /usr/share/nginx/html
COPY dist/images /usr/share/nginx/html/assets/images

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Set upload size limit
RUN echo "client_max_body_size 150M;" > /etc/nginx/conf.d/upload.conf

EXPOSE 80

# Fixed CMD with proper JSON format for better signal handling
CMD ["sh", "-c", "envsubst '$BACKEND_HOST $BACKEND_HOSTNAME $CHAT_HOST $CHAT_HOSTNAME' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
