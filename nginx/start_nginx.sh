#!/bin/bash
nginx -t
service nginx start
sudo -E -u grafana /run.sh

