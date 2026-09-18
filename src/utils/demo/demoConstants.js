export const frequencyOptions = [
    "Todos los días", "23-27 días", "16-22 días", "13-15 días", "6-12 días", "1-5 días", "Ningún día"
];

export const intensityOptions = [
    "Marcadamente", "Moderadamente", "Levemente", "Nada en absoluto"
];

export const proportionOptions = [
    "Siempre", "La mayoría de las veces", "Más de la mitad de las veces", "La mitad de las veces", "Menos de la mitad de las veces", "Alguna vez", "Ninguna vez"
];

export const binaryOptions = ["Si", "No"];
export const conditionalOptions = ["No", "No aplica", "Si"];

export const anxietyFrequencyOptions = [
    "Casi todos los días", "Más de la mitad de los días", "Varios días", "Ningún día"
];

export const questions = [
    // Page 1: Frequency in Days
    { id: 1, text: "¿Has intentado limitar deliberadamente la cantidad de comida que comes para que influya en tu silueta o peso?", options: frequencyOptions, page: 1 },
    { id: 2, text: "¿Has pasado por períodos de 8 o más horas de vigilia sin comer nada para que influya en tu silueta o peso?", options: frequencyOptions, page: 1 },
    { id: 3, text: "¿Has intentado evitar comer algunos alimentos que te gustan para que influya en tu silueta o peso?", options: frequencyOptions, page: 1 },
    { id: 4, text: "¿Has intentado seguir reglas determinadas en tu alimentación destinadas a influir en tu silueta o peso; por ejemplo, limitar calorías, la cantidad total de ingesta, ¿ normas como cuánto o cuándo comer?", options: frequencyOptions, page: 1 },
    { id: 5, text: "¿Has deseado que tu estómago esté vacío?", options: frequencyOptions, page: 1 },

    // Page 2: Frequency in Days
    { id: 6, text: "¿Pensar en alimentos o su contenido calórico ha interferido con tu capacidad de concentrarte en cosas en las que estás interesado como, por ejemplo, leer, ver la TV o seguir una conversación?", options: frequencyOptions, page: 2 },
    { id: 7, text: "¿Has tenido miedo de perder el control sobre la comida?", options: frequencyOptions, page: 2 },
    { id: 8, text: "¿Has tenido episodios de atracones?", options: frequencyOptions, page: 2 },
    { id: 9, text: "¿Has comido en secreto (exceptuando atracones?", options: frequencyOptions, page: 2 },
    { id: 10, text: "¿Has tenido un claro deseo de tener el vientre plano?", options: frequencyOptions, page: 2 },

    // Page 3: Frequency in Days
    { id: 11, text: "¿Pensar en la silueta o el peso ha interferido con tu capacidad de concentrarte en cosas en las que estás interesado, como, por ejemplo, leer, ver la TV o seguir una conversación?", options: frequencyOptions, page: 3 },
    { id: 12, text: "¿Has sentido un claro temor de engordar o de convertirte en obeso/a?", options: frequencyOptions, page: 3 },
    { id: 13, text: "¿Te has sentido gordo/a?", options: frequencyOptions, page: 3 },
    { id: 14, text: "¿Has sentido un fuerte deseo de perder peso?", options: frequencyOptions, page: 3 },

    // Page 4: Frequency in Occasions & Binary
    { id: 15, text: "¿Cuántas veces te has sentido culpable después de comer por el efecto que pueda tener en tu silueta y peso (exceptuando atracones)?", options: proportionOptions, page: 4 },
    { id: 16, text: "¿Ha habido veces en las que has sentido que has comido lo que para otras personas es una cantidad anormalmente grande de comida en esas circunstancias?", options: binaryOptions, page: 4 },
    { id: 17, text: "¿Ha habido otros episodios en los que has tenido la sensación de perder el control y comer demasiado, sin que haya sido una cantidad anormalmente grande en esas circunstancias?", options: binaryOptions, page: 4 },
    { id: 18, text: "¿Te has provocado el vómito para controlar tu figura o tu peso?", options: binaryOptions, page: 4 },
    { id: 19, text: "¿Has tomado laxantes para controlar tu figura o tu peso?", options: binaryOptions, page: 4 },

    // Page 5: Binary & Numeric
    { id: 20, text: "¿Has tomado diuréticos para controlar tu figura o tu peso?", options: binaryOptions, page: 5 },
    { id: 21, text: "¿Has realizado ejercicio enérgico para controlar tu figura o tu peso?", options: binaryOptions, page: 5 },
    { id: 22, text: "En caso afirmativo: ¿Cuántas veces a la semana han tenido lugar como promedio estos episodios de sobre ingesta?", type: "text", page: 5 },
    { id: 23, text: "En caso afirmativo: ¿Durante cuántos de estos episodios de sobre ingesta has tenido la sensación de perder el control sobre lo que comías?", type: "text", page: 5 },

    // Page 6: Intensity
    { id: 24, text: "¿Ha influido tu figura en cómo te has juzgado a ti mismo/a como persona?", options: intensityOptions, page: 6 },
    { id: 25, text: "¿En qué medida te molestaría si tuvieras que pesarte una vez por semana durante los próximos tres meses?", options: intensityOptions, page: 6 },
    { id: 26, text: "¿En qué grado has sentido insatisfacción por tu peso?", options: intensityOptions, page: 6 },
    { id: 27, text: "¿En qué grado has sentido insatisfacción por tu figura?", options: intensityOptions, page: 6 },
    { id: 28, text: "¿En qué grado te ha preocupado que otra gente te vea comer?", options: intensityOptions, page: 6 },

    // Page 7: Intensity & Conditional
    { id: 29, text: "¿En qué grado te has sentido incómodo/a al ver tu cuerpo, por ejemplo, en el espejo, reflejado de un escaparate, cuando te desvistes o te duchas?", options: intensityOptions, page: 7 },
    { id: 30, text: "¿En qué grado te has sentido incómodo/a cuando otros ven tu cuerpo, por ejemplo, en los vestuarios, nadando o llevando ropas ajustadas?", options: intensityOptions, page: 7 },
    { id: 31, text: "CONTESTAR SÓLO SI ERES MUJER: ¿Has tenido alteraciones en la menstruación en los últimos 3 meses?", options: conditionalOptions, page: 7 },
];

export const anxietyQuestions = [
    { id: 201, text: "¿Se ha sentido nervioso(a), ansioso(a) o con los nervios de punta?", options: anxietyFrequencyOptions, page: 1 },
    { id: 202, text: "¿No ha sido capaz de parar o controlar su preocupación?", options: anxietyFrequencyOptions, page: 1 },
    { id: 203, text: "¿Se ha sentido muy preocupado(a) por diferentes cosas al mismo tiempo?", options: anxietyFrequencyOptions, page: 1 },
    { id: 204, text: "¿Ha tenido dificultad para relajarse?", options: anxietyFrequencyOptions, page: 1 },
    { id: 205, text: "¿Se ha sentido tan inquieto(a) que no ha podido quedarse quieto(a)?", options: anxietyFrequencyOptions, page: 1 },
    { id: 206, text: "¿Se ha molestado o irritado fácilmente?", options: anxietyFrequencyOptions, page: 1 },
    { id: 207, text: "¿Ha tenido miedo constante o repetido de que algo malo fuera a suceder?", options: anxietyFrequencyOptions, page: 1 },
];
