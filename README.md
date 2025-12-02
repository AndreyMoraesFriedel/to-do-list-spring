# Projeto: Tela de Login Básico com Spring Boot  
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
- **Java:** 17 ou 21

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

---

## 4️⃣ Estrutura do Projeto (Padrão)

```
src/main/java/com/seuprojeto/todolist/
├── config/
│   └── SecurityConfig.java
├── model/
│   └── User.java
├── dto/
│   └── LoginRequest.java
├── repository/
│   └── UserRepository.java
├── service/
│   └── UserService.java
├── controller/
│   └── AuthController.java
└── ToDoListApplication.java

src/main/resources/static/
├── LoginPage.html
├── css/style.css
└── js/LoginPage.js
```

> O código Java e os arquivos front-end seguem exatamente o padrão do tutorial original (com autenticação funcional via Spring Security + JWT ou sessão).

---

## 5️⃣ Rodando o Projeto

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

## 6️⃣ Extra: Interface Gráfica para o Banco

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

| Tecnologia         | Versão       |
|-------------------|--------------|
| Arch Linux        | Rolling      |
| Java              | 17 ou 21     |
| Spring Boot       | 3.x          |
| Spring Security   | Incluído     |
| MariaDB           | 10.x+        |
| Maven             | 3.9+         |
| VS Code           | Última       |

---

# Tela de login básico (Versão Windows)

## 1\. Configuração do Ambiente (Back-end)

### Instalação de Dependências

No Windows, não usamos um gerenciador de pacotes único por padrão (como o `pacman`). Você deve baixar e instalar os executáveis:

1.  **Java (JDK 17 ou 21):** Baixe e instale o [JDK (Oracle ou OpenJDK)](https://adoptium.net/).
2.  **Visual Studio Code:** Baixe e instale via [code.visualstudio.com](https://code.visualstudio.com/).
3.  **MariaDB:** Baixe o instalador MSI (arquivo .msi) no site oficial [mariadb.org](https://mariadb.org/download/).
      * *Dica:* Durante a instalação do MariaDB, o instalador pedirá uma senha para o `root`. Para seguir este tutorial exatamente como está, você pode deixar em branco (não recomendado para produção) ou definir uma senha e lembrar de alterá-la no passo 3.

### Configuração do Banco de Dados (MariaDB)

No Windows, o MariaDB geralmente é instalado como um **Serviço** que inicia automaticamente.

1.  **Acessar o Banco:**
    Procure no Menu Iniciar por **"MariaDB Command Line Client"** e abra-o. Se pediu senha na instalação, digite-a. Se não, apenas dê Enter.

2.  **Criar o Banco de Dados:**
    Digite os comandos abaixo no terminal do MariaDB:

    ```sql
    /* Se você definiu senha na instalação, pule a linha do ALTER USER */
    ALTER USER 'root'@'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD('');

    /* Criando o banco com o nome correto usado na aplicação */
    CREATE DATABASE todolist;

    FLUSH PRIVILEGES;

    exit
    ```

-----

## 2\. Criar Projeto Spring

1.  Acesse: [https://start.spring.io/](https://start.spring.io/);
2.  Configure exatamente como na versão Linux:
      * **Project:** Maven
      * **Language:** Java
      * **Spring Boot:** Versão estável (ex: 3.x.x)
      * **Packaging:** Jar
      * **Java:** 17 ou 21 (o mesmo que você instalou)
3.  **Dependências:**
      * Spring Web
      * Spring Data JPA
      * Spring Security
      * MariaDB Driver
      * Spring Boot DevTools
4.  Clique em **GENERATE**.
5.  **Descompactar:**
      * Vá até a pasta Downloads.
      * Clique com o botão direito no arquivo `.zip` \> **Extrair Tudo** \> Escolha uma pasta (ex: `C:\Projetos\nome-do-projeto`).
      * Abra o VS Code, vá em `File > Open Folder` e selecione a pasta extraída.

-----

## 3\. Configuração VS Code

Instale as extensões (no ícone de caixas no menu lateral esquerdo):

  * **Extension Pack for Java**
  * **Spring Boot Extension Pack**

### `application.properties` (conexão)

Edite o arquivo `src/main/resources/application.properties`.

```properties
spring.application.name=proj-tela-login

spring.datasource.url=jdbc:mariadb://localhost:3306/todolist
spring.datasource.username=root
# Se você definiu uma senha na instalação do MariaDB, coloque-a abaixo após o igual
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

-----

## 4\. Implementação do Código

A estrutura lógica permanece a mesma. No Windows, a única diferença visual é que o separador de pastas no sistema é a barra invertida `\`, mas dentro do Java e VS Code, você verá a hierarquia de pacotes normalmente.

**Estrutura de arquivos:**

  * `src\main\java\raiz\proj_tela_login\config\SecurityConfig.java`
  * `src\main\java\raiz\proj_tela_login\model\User.java`
  * `src\main\java\raiz\proj_tela_login\controller\AuthController.java`
  * `src\main\resources\static\LoginPage.html`
  * `src\main\resources\static\js\LoginPage.js`
  * `src\main\resources\static\css\style.css`

-----

## 5\. Rodar o Projeto

No Windows, a maneira mais segura (sem precisar configurar Variáveis de Ambiente do Maven manualmente) é usar o **Maven Wrapper** que vem dentro da pasta do projeto.

No terminal do VS Code (Atalho: `Ctrl + '`):

1.  Limpe e execute o projeto usando o script `mvnw`:

    ```powershell
    .\mvnw.cmd clean spring-boot:run
    ```

    *(Nota: O ponto e barra `.\` são necessários no PowerShell).*

Se tudo estiver correto, você verá logs do Spring Boot iniciando e conectando ao banco de dados sem erros.

-----

## 6\. EXTRA

Para ambiente gráfico de banco de dados:

1.  Baixe e instale o **DBeaver Community** para Windows: [dbeaver.io/download](https://dbeaver.io/download/)
2.  Ou utilize o **HeidiSQL** (que muitas vezes vem junto no instalador do MariaDB para Windows).

**Para conectar (DBeaver ou HeidiSQL):**

  * **Host:** localhost
  * **Port:** 3306
  * **Database:** todolist
  * **Username:** root
  * **Password:** (Vazio ou a senha que definiu na instalação)
