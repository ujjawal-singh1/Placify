FROM python:3.11-slim

# Install G++, JDK, and Node.js for multi-language support
RUN apt-get update && apt-get install -y \
    g++ \
    default-jdk \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the runner script
COPY runner.sh .
RUN chmod +x runner.sh

# The script expects: [language] [file_path]
ENTRYPOINT ["bash", "runner.sh"]