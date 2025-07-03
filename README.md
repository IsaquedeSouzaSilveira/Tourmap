# Welcome to Tour_Map

TourMap é um aplicativo móvel que consome uma API local para gerenciamento de pontos turísticos e comerciais.

---

## Requisitos

- Ter o **XAMPP** instalado no computador.
- O **Apache** e o **MySQL** devem estar rodando no XAMPP.
- O MySQL deve estar configurado para rodar na porta **3306** (padrão).
- Ter a API local do TourMap rodando (backend).

---

## Configuração importante

No código do aplicativo, você deve alterar o endereço base da API para o IP local da sua máquina, para que o app consiga se conectar corretamente à API.

No arquivo onde a base da API está configurada, localize:

export const BASE_IP = "http://192.168.0.103:3333";

###Como iniciar a API local

Após configurar o IP, abra um terminal e navegue até o diretório da API local (APILocal):

   cd src/APIs/APILocal

Em seguida, execute o comando para iniciar a API em modo de desenvolvimento:

   npm run dev

Isso vai rodar a API localmente na porta configurada (geralmente a 3333).

Link para instalar o apk: https://expo.dev/artifacts/eas/eCUhEyUWUx2dHytnFYQCK.tar.gz

Observações

    Certifique-se de que o dispositivo (celular ou emulador) e o servidor da API estejam na mesma rede para que a comunicação funcione.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
