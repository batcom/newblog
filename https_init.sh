#!/bin/bash
# 生成ca私钥

cat << EOF > ./v3.ext
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = blog.me
DNS.3 = test.me
DNS.4 = *.blog.me
DNS.5 = *.test.me
IP.1 = 192.168.2.88
IP.2 = 127.0.0.1

EOF


##########CA操作###############
openssl genrsa -aes256 -passout pass:demo -out rootCA.key 4096


###########服务端操作###############
#用生成的私钥生成自签名CA证书
openssl req -x509 -new -nodes -key rootCA.key -newkey rsa:4096 -sha256 -days 3650 -passin pass:demo -out rootCA.pem \
    -subj "/C=CN/ST=GuangDong/L=ShenZhen/O=SunFoBank/OU=IT Dept/CN=*.blog.me/emailAddress=admin@blog.me"

#生成server 需要的私钥，并以此私钥签署请求
openssl req -new -newkey rsa:4096 -sha256 -nodes -keyout device.key -out device.csr \
    -subj "/C=CN/ST=GuangDong/L=ShenZhen/O=SunFoBank/OU=IT Dept/CN=*.blog.me/emailAddress=admin@blog.me"

# 私有CA根据请求来签署证书
openssl x509 -req -in device.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -passin pass:demo \
    -out device.crt -days 3650 -sha256 -extfile v3.ext

