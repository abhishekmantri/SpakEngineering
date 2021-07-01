argv=$*
################################################################################
# Generate swagger docs

echo '[::] Genrating swagger docs...'
node api/generate.js

# Start node server

echo '[::] Starting node server...'
node --max-old-space-size=1024 ./bin/www

################################################################################
