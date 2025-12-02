Instituto Federal Catarinense - Campus Blumenau   
Discentes: Andrey Moraes, Yuri Teixeira, João Gabriel, Reginaldo Filho    
Disciplina: Desenvolvimento Web

# Índice

**Linux (Arch)**
1. [Configuração do Back-end](#1-configuração-do-ambiente-back-end)
2. [Criar Projeto Spring](#2-criar-projeto-spring)
3. [Configuração VS Code](#3-configuração-vscode)
4. [Implementação do Código](#4-implementação-do-código)
5. [Rodar o Projeto](#5-rodar-o-projeto)
6. [Extra (Banco de Dados)](#6-extra)

**Windows**
1. [Configuração do Back-end](#1-configuração-do-ambiente-back-end-1)
2. [Criar Projeto Spring](#2-criar-projeto-spring-1)
3. [Configuração VS Code](#3-configuração-vs-code-1)
4. [Implementação do Código](#4-implementação-do-código-1)
5. [Rodar o Projeto](#5-rodar-o-projeto-1)
6. [Extra (Banco de Dados)](#6-extra-1)

---

# Tela de login básico (Versão Arch Linux)

# 1 Configuração do Ambiente (Back-end)

**Instalação de Dependências**

-> Abra o terminal e execute o comando abaixo para instalar o Java (JDK), Maven e o MariaDB:

```bash
sudo pacman -Syu jdk-openjdk maven mariadb code
````

(versão proprietária: `visual-studio-code-bin` via AUR);

**Configuração do Banco de Dados (MariaDB)**

1.  Iniciar diretório de dados do MariaDB

    ```bash
    sudo mariadb-install-db --user=mysql --basedir=/usr
    ```

    ;

2.  Iniciar e Habilitar Serviço:

    ```bash
    sudo systemctl start mariadb
    sudo systemctl enable mariadb
    ```

    ;

3.  Usuário Root e Criar o Banco:

    ```sql
    sudo mariadb

    ALTER USER 'root'@'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD('');

    CREATE DATABASE todolist;

    FLUSH PRIVILEGES;

    exit
    ```

    ;

# 2 Criar Projeto Spring

1.  Acesse: [https://start.spring.io/];

2.  Configure: (
    Project: Maven,
    Language: Java,
    Spring Boot: Versão estável,
    Packaging: Jar,
    Java: 17 ou 21
    );

3.  Dependências: (
    Spring Web,
    Spring Data JPA,
    Spring Security,
    MariaDB Driver,
    Spring Boot DevTools.
    );

4.  Clique em GENERATE;

5.  Descompacte no diretório de sua preferência:

    ```bash
    unzip nome-do-projeto.zip
    cd nome-do-projeto
    code .
    ```

    ;

# 3 Configuração vscode

Instale as extensões: (
Extension Pack for Java,
Spring Boot Extension Pack
);

// `application.properties` (conexão)

Edite o arquivo `src/main/resources/application.properties`. A configuração para Arch Linux será:

```properties
spring.application.name=proj-tela-login

spring.datasource.url=jdbc:mariadb://localhost:3306/teladelogin
spring.datasource.username=root
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

;

# 4 Implementação do Código

A estrutura de código Java (SecurityConfig, Model, DTO, Repository, Service, Controller) e os arquivos Front-end (HTML, CSS, JS) permanecem iguais ao tutorial original;

**Estrutura de diretórios no Linux (VS Code):**

  * `src/main/java/raiz/proj_tela_login/config/SecurityConfig.java`
  * `src/main/java/raiz/proj_tela_login/model/User.java`
  * `src/main/java/raiz/proj_tela_login/controller/AuthController.java`
  * `src/main/resources/static/LoginPage.html`
  * `src/main/resources/static/js/LoginPage.js`
  * `src/main/resources/static/css/style.css`

# 5 Rodar o Projeto

No terminal do Linux (dentro da pasta raiz do projeto):

1.  Certifique-se que o Maven está instalado corretamente:

    ```bash
    mvn -version
    ```

2.  Limpe e execute o projeto:

    ```bash
    mvn clean spring-boot:run
    ```

Se tudo estiver correto, você verá logs do Spring Boot iniciando e conectando ao banco de dados sem erros.

# 6 EXTRA

Para ambiente grafico para banco de dados:

```bash
sudo pacman -S dbeaver
```

Para conectar:

  * **Host:** localhost
  * **Port:** 3306
  * **Database:** teladelogin
  * **Username:** root
  * **Password:** (deixe vazio)

-----

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
    CREATE DATABASE teladelogin;

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

spring.datasource.url=jdbc:mariadb://localhost:3306/teladelogin
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
  * **Database:** teladelogin
  * **Username:** root
  * **Password:** (Vazio ou a senha que definiu na instalação)
