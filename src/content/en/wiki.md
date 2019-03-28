---
title: Wiki

bugs_packages: for bugs and packages
---
There are two ways to install, with the [install-mazon.sh](install-mazon.sh)
(dep dialog) script or the manual form as follows:

#### Pre Requirements:

- [Download MazonOS](http://mazonos.com/releases/)
- An existing Linux distribution or a Linux livecd. <br>
- Create root partition using cfdisk or gparted (ext4) and DOS table / - min 20GB

Format partition:
`# mkfs.ext4 /dev/sdx(x)`

Mount partition in /mnt:
`# mount /dev/sdx(x) /mnt`

Unzip the mazonos file in /mnt:
`# tar -xJpvf /xxx/xxx/mazonos.tar.xz -C /mnt`

Go to /mnt directory:
`# cd /mnt`

Mount proc / dev / sys and chroot to /mnt:
`# mount --type proc /proc proc/`
`# mount --rbind /dev dev/`
`# mount --rbind /sys sys/`
`# chroot /mnt`

Once in chroot, let's change the fstab file in /etc/fstab, using vim or nano.

Add your root partition (replace (x)) and save the file.
In case you don't remember which is the root partition, use fdisk -l to see it.

`/dev/sdx(x) / ext4 defaults 1 1`

#### BOOT USING MAZONOS GRUB

- Install grub to your disk:
`# grub-install /dev/sd(x)`

- Create grub.cfg:
`# grub-mkconfig -o /boot/grub/grub.cfg`

- Exit chroot and unmount the partitions:
`# exit`
`# umount -Rl /mnt`

- Reboot your system and enjoy **MazonOS**.

#### DUAL BOOT USING EXISTING GRUB

- If you want to do a dual boot with your existing system with a working grub, exit the chroot

with "exit" command and unmount the partitions with:<br>

`# exit`
`# umount -Rl /mnt`
`# update-grub`

- Reboot your system and enjoy **MazonOS**.

After installing and logging in a login system: root password: root, add a user with:
`# useradd -m -G audio,video,netdev username`

Add a password with:
`# passwd username`
`# exit`

Log in to the system with your new user and password, startx to start.

## Contact

IRC: irc.freenode.net **Channel:** #mazonos
Email: root@mazonos.com #
