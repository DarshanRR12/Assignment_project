function setOnChangeListener(cb) {
    document.getElementById("currency").addEventListener(
        "input",
        (evt) => cb(evt.target.value)
    );
}

const search = async (currencySearchQuery) => {
    const url = `https://restcountries.com/v3.1/currency/${currencySearchQuery.toLowerCase()}`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error();
        }

        const data = await response.json();
        return {
            data,
            status: "success"
        }
    } catch (error) {
        return {
            status: "error",
            error: "Invalid currency"
        }
    }
}

const createCardElement = ({ cardBodyChildren, cardImageUrl }) => {
    const card = document.createElement('div');
    card.classList.add('card');

    if (cardImageUrl) {
        const img = document.createElement('img');
        img.src = cardImageUrl;
        img.classList.add('card-img-top');
        card.appendChild(img);    
    }

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBody.appendChild(cardBodyChildren);

    card.appendChild(cardBody);
    
    return card;
}

const countryFlagDataCard = (flagUrl, countryName, capitalName) => {
    const cardBodyChildren = document.createElement('div');
    
    const cardBodyTitle = document.createElement('h3');
    cardBodyTitle.classList.add('card-title');
    cardBodyTitle.innerText = `Name: ${countryName}`;

    const cardBodyText = document.createElement('p');
    cardBodyText.classList.add('card-text');
    cardBodyText.innerText = `Capital: ${capitalName}`;


    cardBodyChildren.appendChild(cardBodyTitle);
    cardBodyChildren.appendChild(cardBodyText);

    return createCardElement({ cardImageUrl: flagUrl, cardBodyChildren });
}

const flagUrl = (countryCode) => {
    return `https://flagsapi.com/${countryCode}/flat/64.png`;
}

const displayCards = (countryList) => {
    const container = document.getElementById('result');
    container.innerHTML = '';

    countryList.slice(0, 3).forEach((country) => {
        const countryName = country.name.common;
        const capital = country.capital ? country.capital[0] : 'Not Available';

        const card = countryFlagDataCard(
            flagUrl(country.cca2),
            countryName,
            capital
        );
        container.appendChild(card);
    });
}

const displayNotFound = () => {
    const container = document.getElementById('result');
    container.innerHTML = '';

    const card = createCardElement({
        cardBodyChildren: document.createTextNode('No Country Found')
    });

    card.classList.add('not-found');

    container.appendChild(card);
}

const displayDefaultCard = () => {
    const container = document.getElementById('result');
    container.innerHTML = '';

    const card = createCardElement({
        cardBodyChildren: document.createTextNode('Enter a currency code to search')
    });

    card.classList.add('default');

    container.appendChild(card);
}

const updateUi = async (currencySearchQuery) => {
    if (!currencySearchQuery) {
        return displayDefaultCard();
    }

    const response = await search(currencySearchQuery);
    if ('error' in response) {
        displayNotFound();
    } else {
        displayCards(response.data || []);
    }
}

window.onload = async function() {
    let timeoutId;

    setOnChangeListener((currencySearchQuery) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            updateUi(currencySearchQuery);
        }, 500);
    });

    displayDefaultCard();
}