---
title: Wiki
---
Existem duas maneiras para realizar a instalação, com o script [install-mazon.sh](install-mazon.sh) (dep dialog) ou de forma manual, do seguinte modo:

##### Pré Requisitos:
- [Download MazonOS](http://mazonos.com/releases/)
- Ter uma distribuição Linux existente ou Linux liveCD.
- Criar partição da raiz usando cfdisk ou gparted (ext4) e tabela DOS / - min 20GB

Formatar a partição:  
`# mkfs.ext4 /dev/sdx(x)`

Montar a partição em /mnt:  
`# mount /dev/sdx(x) /mnt`

Extrair o arquivo da Mazon OS em /mnt:  
`# tar -xJpvf /xxx/xxx/mazonos.tar.xz -C /mnt`

Ir para o diretório /mnt:  
`# cd /mnt`

Montar proc / dev / sys e chroot para /mnt:  
`# mount --type proc /proc proc/`  
`# mount --rbind /dev dev/`  
`# mount --rbind /sys sys/`  
`# chroot /mnt`

Uma vez em chroot, vamos alterar o arquivo fstab em /etc/fstab, usando vim ou nano.

Adicione sua partição raiz (substitua (x)) e salve o arquivo.
Caso você não se lembre qual é a sua partição raíz, use fdisk -l para vê-la.  
`/dev/sdx(x) / ext4 defaults 1 1`

###### ( BOOT USANDO O GRUB DA MAZONOS )
- Instalar o grub em seu disco:  
`# grub-install /dev/sd(x)`  
- Criar grub.cfg:  
`# grub-mkconfig -o /boot/grub/grub.cfg`  
- Sair do chroot e desmontar as partições:  
`# exit`  
`# umount -Rl /mnt`  
- Reinicie o seu sistema e aproveite a **MazonOS**.

###### ( DUAL BOOT USANDO GRUB JÁ EXISTENTE )
- Se você quer fazer dual boot com um sistema já existente e grub funcionando, saia do chroot com o comando `exit` e desmonte as partições com:  
`# exit`  
`# umount -Rl /mnt`  
`# update-grub`  
- Reinicie o seu sistema e aproveite a **MazonOS**.

Após instalar e efetuar o login no sistema: senha do root: root, adicione um usuário com:  
`# useradd -m -G audio,video,netdev username`

Adicione a senha do usuário com:  
`# passwd username`  
`# exit`

Entre no sistema com seu novo usuário e senha, para iniciar use startx.

### Contato

**IRC**: irc.freenode.net **Channel:** #mazonos  
**Email**: root@mazonos.com # para bugs e pacotes
