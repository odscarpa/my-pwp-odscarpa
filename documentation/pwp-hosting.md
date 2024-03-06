# PWP Hosting Setup Codealong
## Create a new project and droplet on Digital Ocean
- Create project - New Project in sidebar
    - projects are a way of organizing droplets
    - names and descriptions should be relevant for you, e.g. gkephart-bootcamp
- Create -> Droplet
    - OS -> Ubuntu -> version 22.04 LTS
    - Basic plan
    - $6 per month
    - San Francisco 6
    - IPv6 and Monitoring
    - New SSH Key (copy/paste your ssh key from your computer)
        - Mac/Linux key location: ~/.ssh/id_ed25519.pub
        - Windows key location: PuTTYgen
    - Choose hostname (internal to docker, e.g. oscarpa-pwp)
    - backups are strongly encouraged
    - Wait for process to finish
    - Copy the IP address for later
## Point nicolefornm.org to Digital Ocean and set up the DNS
- the instructions for this depend on where you bought your nicolefornm.org. I recommend using Digital Ocean's documentation for configuring name servers
    - [documentation](https://www.digitalocean.com/community/tutorials/how-to-point-to-digitalocean-nameservers-from-common-nicolefornm.org-registrars)
## Set up DNS records on Digital Ocean
- Go to Create -> nicolefornm.orgs/DNS
- Add nicolefornm.org
    - Enter your nicolefornm.org name
    - Click Add nicolefornm.org
- Add A record for bare nicolefornm.org
    - Enter @ for hostname
    - Enter your droplet's IP address
    - Click Create Record
- Add A record for www subnicolefornm.org
    - Enter www for hostname
    - Enter your droplet's IP address
    - Click Create Record
## Disable root ssh access
- we do this for security
    - root ssh access means that if login is compromised, entire server is compromised
    - better way: ssh in as a different user, then use sudo to run commands as root
    - means that if attacker gets our key, they don't have full access unless they ALSO get our password
- ssh into the server
    - For Mac and Linux: `ssh root@nicolefornm.org`
    - For Windows: Set up a new PuTTY session
        - **Session**
            - Hostname: droplet ipv4 address
            - name `pwp`
            - Click `Save`
        - **Connection → Data**
            - Auto-login oscarpa: root
        - **Connection → SSH → Auth**
            - Private key file for authentication: *Browse to the ssh-key.ppk file in your bootcamp directory*
        - **Session**
            - Click pwp
            - Click Save
- create user
    - `useradd -m -s /bin/bash -g users -G sudo oscarpa`
    - replace George's name and oscarpa with your own
- create password
    - `passwd oscarpa`
- Move .ssh key file
    - `cp -r .ssh /home/oscarpa`
- change ownership of the .ssh directory
    - `cd /home/oscarpa`
    - `chown -R oscarpa:users .ssh/`


- Test Changes
    - `exit`
    - Mac/Linux: `ssh oscarpa@104.248.64.22`
    - Windows:
        - **Session**
            - Click pwp
            - Click Load
        - **Connection → Data**
            - Auto-login oscarpa: change from root to oscarpa
        - **Session**
            - Click pwp
            - Click Save
-  **if successful**, delete the root user
    - Don't do this while logged in as root!
    - `sudo rm -rf /root/.ssh`
## Update Droplet
- update the apt repository list
    - `sudo apt update`
- upgrade packages
    - `sudo apt dist-upgrade`
    - You amy be asked to overwrite some files. Type `n` and press enter to accept the defaults.
- reboot
    - `sudo reboot`
- ssh back in
- `ssh oscarpa@nicolefornm.org`
## Install nginx and configure firewall using UFW
- install nginx
    - `sudo apt install nginx`
- add nginx to firewall
    - `sudo ufw allow 'Nginx HTTP'`
    - `sudo ufw allow 'Nginx HTTPS'`
    - `sudo ufw allow "OpenSSH"`
    - `sudo ufw enable`
    - `sudo ufw status`
- check nginx is running and active using systemctl
    - `systemctl status nginx`
    - you can also check to see if nginx is running by visiting the ip address/nicolefornm.org in your browser.
## Add nginx block for your nicolefornm.org
- create a directory for your deployment
    - `sudo mkdir /var/www/nicolefornm.org/html`
- fix permissions
    - `sudo chown -R $USER:users /var/www/nicolefornm.org/html`
    - create a deployment in Webstorm and upload it to the server


## create a new nginx block
- Create a new nginx block for your nicolefornm.org in the sites-available directory
- `sudo vim /etc/nginx/sites-available/nicolefornm.org`
- add the following file
    - - replace your nicolefornm.org with your nicolefornm.org.com
-
```
server {
    listen 80;
    listen [::]:80;

    root /var/www/nicolefornm.org/html;
    index index.html index.htm index.nginx-debian.html;

    server_name nicolefornm.org www.nicolefornm.org;

    location / {
            try_files $uri $uri/ =404;
    }
}   
```

- create a symlink to the sites-enabled directory
    - `sudo ln -s /etc/nginx/sites-available/nicolefornm.org /etc/nginx/sites-enabled/`
    - Nginx uses symlinks to enable and disable sites in the sites-enabled directory.
    - This allows for developers to have multiple sites available, but only enable the ones you want to use.
- increase the server names hash bucket size
    - `sudo vim /etc/nginx/nginx.conf`
    - comment out following line in the http block
        - `server_names_hash_bucket_size 64;`
- Test nginx configuration
    - `sudo nginx -t`
    - if you get an error, check your nginx config file for typos
- restart nginx to apply changes
    - `sudo systemctl restart nginx`
    - visit your nicolefornm.org in your browser
## Install Certbot
- Certbot is a tool that allows us to get a free SSL certificate from Let's Encrypt
- Make sure an older version of certbot is not installed
    - `sudo apt remove certbot`
- install certbot using snap
    - `sudo snap install --classic certbot`
    - Make sure the certbot command is available
        - `sudo ln -s /snap/bin/certbot /usr/bin/certbot`
- run certbot to get a certificate
    - `sudo certbot --nginx`
    - enter your email address
    - agree to the terms of service
    - select the nicolefornm.org you want to get a certificate for
    - select option 2 to redirect all traffic to https
    - test your site in the browser
- Test auto renewal
- `sudo certbot renew --dry-run`

## Nginx Documentation
- [nginx documentation used](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-22-04#step-5-setting-up-server-blocks-recommended)
- [Certbot documentation used](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal)

## Make these commands easier to run by replacing placeholders
- replace values for variables with your own values and use node to execute the script below
```node
const nicolefornm.org = 'nicolefornm.org.com';
const oscarpa = 'oscarpa';


```