---
title: SLURM batch script
tags:
  - slurm
  - greene
date: 2025-09-09
---

this is my template SLURM batch script for for running python jobs on Greene.
Greene requests that python be installed in and run from Singularity containers, so I've included the Singularity incantation here.

in general, for a python script at `/path/to/project/script.py`, I'll include this in a file called `/path/to/project/run_script.sh`.
then the job is submitted with `sbatch run_script.sh`.


```bash
#!/bin/bash
#SBATCH -J job_name
#SBATCH -t 02-12:00:00
#SBATCH --mem 16G
#SBATCH --nodes 1
#SBATCH --ntasks-per-node 1
#SBATCH --cpus-per-task 1
#SBATCH --gres gpu
#SBATCH mail-type ALL
#SBATCH mail-user address@example.com
#SBATCH -o slurm-%x-%j.out
#SBATCH -e slurm-%x-%j.out

module purge
singularity exec \
    --nv \
    --overlay /path/to/overlay.ext3:ro \
    /scratch/work/public/singularity/*.sif \
    /bin/bash -c \
    "cd /path/to/script/; \
    python py_script.py --args"
```

some notes on using this:

- omit the lines `#SBATCH --gres gpu` and `--nv` if you don't need a GPU
- change `:ro` to `:rw` if you'll need to modify files in the `/ext3` overlay
- be sure to activate your python env if necessary inside the bash command
- the file `slurm-*.out` will get written where you run the `sbatch` command;
    change it to an absolute path `/path/to/slurm-%x-%j.out` if you don't want this

