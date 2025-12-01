Instituto Federal Catarinense Campus Blumenau 
Discentes: Andrey Moraes, Yuri Teixeira, João Gabriel, Reginaldo
Disciplina: Desenvolvimento Web

Tela de login básico(Versão Arch Linux)

# 1 Configuração do Ambiente (Back-end)

// Instalação de Dependências

    -> Abra o terminal e execute o comando abaixo para instalar o Java (JDK), Maven e o MariaDB:

    sudo pacman -Syu jdk-openjdk maven mariadb code    

    versão proprietária: `visual-studio-code-bin` via AUR);

// Configuração do Banco de Dados (MariaDB)

    1.  Iniciar diretório de dados do MariaDB

        sudo mariadb-install-db --user=mysql --basedir=/usr
    ;    

    2.  Iniciar e Habilitar  Serviço:

        sudo systemctl start mariadb
        sudo systemctl enable mariadb
    ;

    3.  Usuário Root e Criar o Banco:

        sudo mariadb

        ALTER USER 'root'@'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD('');

        CREATE DATABASE todolist;

        FLUSH PRIVILEGES;

        exit
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

        unzip nome-do-projeto.zip
        cd nome-do-projeto
        code .
        ;



# 3 Configuração vscode

Instale as extensões: (
    Extension Pack for Java, 
    Spring Boot Extension Pack
);

// `application.properties` (conexão)

Edite o arquivo `src/main/resources/application.properties`. A configuração para Arch Linux será:

properties
spring.application.name=proj-tela-login

spring.datasource.url=jdbc:mariadb://localhost:3306/teladelogin
spring.datasource.username=root
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
;

# 4 Implementação do Código

A estrutura de código Java (SecurityConfig, Model, DTO, Repository, Service, Controller) e os arquivos Front-end (HTML, CSS, JS) permanecem iguais ao tutorial original;

    Estrutura de diretórios no Linux (VS Code):

  * `src/main/java/raiz/proj_tela_login/config/SecurityConfig.java`
  * `src/main/java/raiz/proj_tela_login/model/User.java`
  * `src/main/java/raiz/proj_tela_login/controller/AuthController.java`
  * `src/main/resources/static/LoginPage.html`
  * `src/main/resources/static/js/LoginPage.js`
  * `src/main/resources/static/css/style.css`

# 5 Rodar o Projeto

    No terminal do Linux (dentro da pasta raiz do projeto):

    1.  Certifique-se que o Maven está instalado corretamente:

        mvn -version

    2.  Limpe e execute o projeto:

        mvn clean spring-boot:run

    Se tudo estiver correto, você verá logs do Spring Boot iniciando e conectando ao banco de dados sem erros.

# 6 EXTRA

    para ambiente grafico para banco de dados : 

    sudo pacman -S dbeaver

    Para conectar:

    * **Host:** localhost
    * **Port:** 3306
    * **Database:** teladelogin
    * **Username:** root
    * **Password:** (deixe vazio)