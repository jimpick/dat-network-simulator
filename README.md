# dat-network-simulator

Work-in-progress.

This is an experiment to see how feasible it is to build a network
simulation environment so we can do integrated testing of all of the
parts of the Dat ecosystem.

## Parts of the simulator

* Runs on Linux (I'm developing with Ubuntu 16.04)
* tape - test runner
* mininet - sets up complex virtual network topologies
* mkbootstrap - build disk images for virtual machines (similar to Dockerfiles)
* systemd-nspawn - a Linux virtual machine system based on KVM

## Progress

It can currently set up a mininet network - the next step is to add some more
library code to enable installing and running software and tests on the
individual nodes.

