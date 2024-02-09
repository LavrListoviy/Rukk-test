import re
import requests

# Результирующая функция


def get_phones(url: str) -> list[str]:
    html = parse_page_by_url(url)
    return format_all_numbers(get_phone_number(html))

# Функция запроса html по заданному URL


def parse_page_by_url(url: str) -> str:
    response = requests.get(url)
    html = response.text
    return html

# Получение номеров телефонов при помощи регулярных выражений
# Если не найдены номера в формате 8 (KKK) NNN-NN-NN или +7KKKNNNNNNN или подобным,
# то поиск идет по форматам NNN-NN-NN или NNNNNNN или подобным
# Это сделано для снижения нагрузки на проверку реальности телефонов, ибо при втором типе форматов
# невозможно на 100% быть уверенным в том, что это номер телефона, а не случайный набор цифр из кода страницы


def get_phone_number(html: str) -> list[str]:
    phone_regex_long = r'(?:\+7|\b8)\s*\(\d{3}\)\s*\d{3}-\d{2}-\d{2}|\+7\d{10}'
    phone_regex_short = r'\d{3}-\d{2}-\d{2}|\d{7}'
    matches_long = re.findall(phone_regex_long, html)
    matches_short = re.findall(phone_regex_short, html)
    return matches_long if matches_long else matches_short if matches_short else []

# Приведение всех полученных номеров к единому формату


def format_all_numbers(num_arr: list[str]) -> list[str]:
    formatted_numbers = []
    for number in num_arr:
        removed_spaces = re.sub(r'[\s\-()]', '', number)
        if len(number) == 7:
            if "8495" + removed_spaces not in formatted_numbers:
                formatted_numbers.append("8495" + removed_spaces)
        elif number[0] == "+":
            if "8" + removed_spaces[2:] not in formatted_numbers:
                formatted_numbers.append("8" + removed_spaces[2:])
        else:
            if "8" + removed_spaces[1:] not in formatted_numbers:
                formatted_numbers.append("8" + removed_spaces[1:])
    return formatted_numbers

# Пример использования функции


print(get_phones('https://repetitors.info/'))
