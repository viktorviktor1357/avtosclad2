{pkgs}: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"
  
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.yarn
    pkgs.nodePackages.pnpm
    pkgs.bun
    pkgs.openssl.dev
  ];

  # Sets environment variables in the workspace
  env = {
    # Здесь можно добавить переменные окружения, если это необходимо
    NODE_ENV = "development";
  };

  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # Пример расширений для использования в Codespaces
      "ms-vscode.vscode-typescript-next"  # TypeScript
      "esbenp.prettier-vscode"              # Prettier
      "dbaeumer.vscode-eslint"              # ESLint
    ];

    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        npm-install = "npm ci --no-audit --prefer-offline --no-progress --timing";
        
        # Open editors for the following files by default, if they exist:
        default.openFiles = [
          "pages/index.tsx" "pages/index.js"
          "src/pages/index.tsx" "src/pages/index.js"
          "app/page.tsx" "app/page.js"
          "src/app/page.tsx" "src/app/page.js"
        ];
      };
      
      # To run something each time the workspace is (re)started, use the `onStart` hook
      onStart = {
        # Здесь можно добавить команды, которые нужно выполнять при запуске
        run = "echo 'Workspace started!'";
      };
    };

    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
