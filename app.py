import subprocess

def run_command(command):
    """Запускает команду в терминале и выводит результат."""
    try:
        result = subprocess.run(command, check=True, shell=True, text=True, capture_output=True)
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Ошибка при выполнении команды: {e}")
        print(e.stderr)

def main():
    # Выполняем команду make app
    print("Запуск приложения...")
    run_command("make app")

    # Выполняем миграции
    print("Выполнение миграций...")
    run_command("make migrate")

if __name__ == "__main__":
    main()