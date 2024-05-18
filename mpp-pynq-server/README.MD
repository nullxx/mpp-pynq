### Setup

Execute all commands as root:

```console
xilinx@pynq:~$ sudo -s
[sudo] password for xilinx:
root@pynq:/home/xilinx#
```

Load this folder into a PYNQ Z1 board and run the following command to install the required dependencies:

```console
root@pynq:/home/xilinx/mpp# python -m pip install -r requirements.txt
```

### Usage

```console
root@pynq:/home/xilinx/mpp# chmod +x run.sh

root@pynq:/home/xilinx/mpp# ./run.sh main.py
 * Serving Flask app 'main' (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on all addresses (0.0.0.0)
   WARNING: This is a development server. Do not use it in a production deployment.
 * Running on http://127.0.0.1:3000
 * Running on http://192.168.1.128:3000 (Press CTRL+C to quit)
```

### Tests

The [tests.ipynb](tests.ipynb) notebook contains unit and integration tests for the M++ architecture. It is recommended to run the tests before deploying the server.