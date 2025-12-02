# Projeto: Gerenciador De Tarefas com Spring Boot

**Instituto Federal Catarinense – Campus Blumenau**  
**Disciplina:** Desenvolvimento Web  
**Alunos:** Andrey Moraes, Yuri Teixeira, João Gabriel, Reginaldo

<p align="center">
  <img src="https://img.shields.io/badge/Arch%20Linux-1793D1?style=for-the-badge&logo=arch-linux&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" />
  <img src="https://img.shields.io/badge/Java-21%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" />
  <img src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white" />
</p>

Projeto de uma tela de login completa (front + back) utilizando **Spring Boot + Spring Security + MariaDB**, totalmente configurado e testado no **Arch Linux**.

---

## 1️⃣ Configuração do Ambiente no Arch Linux (Back-end)

### Instalação das Dependências

```bash
sudo pacman -Syu jdk-openjdk maven mariadb code
```

> Dica: Se preferir o Visual Studio Code proprietário:
>
> ```bash
> yay -S visual-studio-code-bin
> ```

### Configuração do MariaDB

```bash
# 1. Criar diretório de dados
sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql

# 2. Iniciar e habilitar o serviço
sudo systemctl start mariadb
sudo systemctl enable mariadb

# 3. Acessar o MariaDB como root e configurar
sudo mariadb
```

Dentro do prompt do MariaDB:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD('');
CREATE DATABASE todolist;
FLUSH PRIVILEGES;
EXIT;
```

---

## 2️⃣ Criando o Projeto Spring Boot

Acesse: [https://start.spring.io](https://start.spring.io)

### Configurações do Projeto:

- **Project:** Maven
- **Language:** Java
- **Spring Boot:** Última versão estável
- **Packaging:** Jar
- **Java:** 21

### Dependências obrigatórias:

- Spring Web
- Spring Data JPA
- Spring Security
- MariaDB Driver
- Spring Boot DevTools

Clique em **GENERATE**, baixe, descompacte e abra:

```bash
unzip seu-projeto.zip
cd seu-projeto
code .
```

---

## 3️⃣ Configuração no VS Code

Instale as extensões recomendadas:

- **Extension Pack for Java**
- **Spring Boot Extension Pack**
- **Maven for Java**
- **Live Server**
- **Language Support for Java(TM) by Red Hat**


### Configuração da conexão com o banco (`application.properties`)

Edite: `src/main/resources/application.properties`

```properties
spring.application.name=todolist

# Conexão com MariaDB (root sem senha - ambiente de desenvolvimento)
spring.datasource.url=jdbc:mariadb://localhost:3306/todolist
spring.datasource.username=root
spring.datasource.password=

# Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MariaDBDialect
```

## 4️⃣Rodando o Projeto

No terminal, dentro da pasta do projeto:

```bash
# Verificar Maven
mvn -version

# Limpar e executar
mvn clean spring-boot:run
```

Se tudo estiver certo, você verá:

```
Tomcat started on port(s): 8080 (http)
```

Acesse: [http://localhost:8080](http://localhost:8080)

---

Extra: Interface Gráfica para o Banco

Instale o **DBeaver** (melhor client SQL gratuito):

```bash
sudo pacman -S dbeaver
```

### Conexão com o banco:

- **Host:** `localhost`
- **Porta:** `3306`
- **Database:** `todolist`
- **Usuário:** `root`
- **Senha:** (deixe em branco)

---

## Tecnologias Utilizadas

| Tecnologia      | Versão   |
| --------------- | -------- |
| Arch Linux      | Rolling  |
| Java            | 21+      |
| Spring Boot     | 3.x      |
| Spring Security | Incluído |
| MariaDB         | 10.x+    |
| Maven           | 3.9+     |
| VS Code         | Última   |

---
