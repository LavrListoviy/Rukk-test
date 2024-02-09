// Результирующая функция
export const getPhones = async (url: string): Promise<string[]> => {
  return parsePageByURL(url).then((r) => formatAllNumbers(getPhoneNumber(r)));
};

// Ассинхронная функция запроса html по заданному URL
const parsePageByURL = async (url: string): Promise<string> => {
  const html = fetch(url, { method: "GET" }).then((r) => r.text());

  return html;
};

// Получение номеров телефонов при помощи регулярных выражений
// Если не найдены номера в формате 8 (KKK) NNN-NN-NN или +7KKKNNNNNNN или подобным,
// то поиск идет по форматам NNN-NN-NN или NNNNNNN или подобным
// Это сделано для снижения нагрузки на проверку реальности телефонов, ибо при втором типе форматов
// невозможно на 100% быть уверенным в том, что это номер телефона, а не случайный набор цифр из кода страницы
const getPhoneNumber = (html: string): string[] => {
  const phoneRegexLong =
    /(?:\+7|\b8)\s*\(\d{3}\)\s*\d{3}-\d{2}-\d{2}|\+7\d{10}/g;
  const phoneRegexShort = /\d{3}-\d{2}-\d{2}|\d{7}/g;
  const matchesLong = html.match(phoneRegexLong);
  const matchesShort = html.match(phoneRegexShort);
  return matchesLong ? matchesLong : matchesShort ? matchesShort : [];
};

// Приведение всех полученных номеров к единому формату
const formatAllNumbers = (numArr: string[]) => {
  const formattedNumbers: any[] = [];
  for (let number of numArr) {
    const removedSpaces = number.replace(/[\s\-()]/g, "");
    if (number.length === 7) {
      if (!formattedNumbers.includes("8495" + removedSpaces)) {
        formattedNumbers.push("8495" + removedSpaces);
      }
    } else if (number[0] == "+") {
      if (!formattedNumbers.includes("8" + removedSpaces.slice(2))) {
        formattedNumbers.push("8" + removedSpaces.slice(2));
      }
    } else {
      if (!formattedNumbers.includes("8" + removedSpaces.slice(1))) {
        formattedNumbers.push("8" + removedSpaces.slice(1));
      }
    }
  }
  return formattedNumbers;
};

// Пример использования функции
getPhones("https://hands.ru/company/about").then(r => console.log(r));