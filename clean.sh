#!/bin/zsh

source ~/.zshrc

cleanup() {
    ports=(3030)

    for port in "${ports[@]}"; do
        pid=$(lsof -i :"$port" | awk 'NR==2 {print $2}')

        # Check if the PID is not empty before using it
        if [ -n "$pid" ]; then
            kill "$pid"
            echo "Found PID $pid for port $port. Killing the process..."
        fi
    done
}

cleanup

