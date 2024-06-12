const message = prompt("Ваш запрос: ");

async function func(str) {
  if (!str) {
    alert("Вы ничего не ввели");
    return;
  }

  if (typeof str !== "string") {
    alert("Вы ввели не строку");
    return;
  }

  const regExp =
    /^(?:хочу)?\s*открыть\s*вклад\s*(?:первый|управляемый|история\s*успеха|ваш\s*пенсионный|большие\s*возможности)$/g;

  const replacedStr = str.toLowerCase().trim().replace(/\s+/g, " ");

  if (!regExp.test(replacedStr)) {
    alert("Я не понял ваш запрос");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/deposits");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const filteredData = data
      .map((deposit) => ({
        productName: deposit.productName,
        minimumTerm: deposit.products[0].terms[0].minimumTerm,
        maxProfitRate: deposit.products[0].maxProfitRate,
        minBalance: deposit.products[0].terms[0].rates[0].minBalance,
      }))
      .find((deposit) =>
        replacedStr.includes(deposit.productName.toLowerCase())
      );

    const answer = prompt(
      `Название вклада: ${filteredData.productName}\n срок вклада: ${filteredData.minimumTerm}\n процентная ставка: ${filteredData.maxProfitRate}\n минимальная сумма вклада: ${filteredData.minBalance}\n Вы согласны открыть вклад?`
    );

    if (!answer || answer.toLowerCase() !== "да" && answer.toLowerCase() !== "согласен") {
      alert("Жаль, что условия вам не подошли. Приходите еще");
    } else {
      alert("Отлично! Ваш вклад открыт");
    }
  } catch (error) {
    console.log(error);
  }
}

func(message);
