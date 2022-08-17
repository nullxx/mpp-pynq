export const SITE = {
	title: 'Documentación',
	description: 'M++ simulator docs.',
	defaultLanguage: 'es_ES',
};


export const KNOWN_LANGUAGES = {
	Spanish: 'es',
};

// Uncomment this to add an "Edit this page" button to every page of documentation.
export const GITHUB_EDIT_URL = `https://github.com/nullxx/mpp/tree/master/_docs/`;

// Uncomment this to add an "Join our Community" button to every page of documentation.
// export const COMMUNITY_INVITE_URL = `https://astro.build/chat`;

// Uncomment this to enable site search.
// See "Algolia" section of the README for more information.
// export const ALGOLIA = {
//   indexName: 'XXXXXXXXXX',
//   appId: 'XXXXXXXXXX',
//   apiKey: 'XXXXXXXXXX',
// }

export const SIDEBAR = {
	es: [
		{ text: '', header: true },
		{ text: 'Sobre mpp', header: true },
		{ text: 'Introducción', link: 'es/introduction' },
		{ text: 'Arquitectura', link: 'es/architecture' },
		{ text: 'Detalles', link: 'es/about' },


		{ text: 'USO', header: true },
		{ text: 'Operaciones soportadas', link: 'es/operations/operations' },
		{ text: 'MOV', link: 'es/operations/MOV'},
		{ text: 'SUB', link: 'es/operations/SUB'},
		{ text: 'ADD', link: 'es/operations/ADD'},
		{ text: 'INC', link: 'es/operations/INC'},
		{ text: 'CMP', link: 'es/operations/CMP'},
		{ text: 'AND', link: 'es/operations/AND'},
		{ text: 'OR', link: 'es/operations/OR'},
		{ text: 'XOR', link: 'es/operations/XOR'},
		{ text: 'CMA', link: 'es/operations/CMA'},
		{ text: 'LDA', link: 'es/operations/LDA'},
		{ text: 'STA', link: 'es/operations/STA'},
		{ text: 'LDAX', link: 'es/operations/LDAX'},
		{ text: 'STAX', link: 'es/operations/STAX'},
		{ text: 'SFA', link: 'es/operations/SFA'},
		{ text: 'LFA', link: 'es/operations/LFA'},
		{ text: 'INISP', link: 'es/operations/INISP'},
		{ text: 'PUSH', link: 'es/operations/PUSH'},
		{ text: 'POP', link: 'es/operations/POP'},
		{ text: 'BEQ', link: 'es/operations/BEQ'},
		{ text: 'BC', link: 'es/operations/BC'},
		{ text: 'JMP', link: 'es/operations/JMP'},
		{ text: 'CALL', link: 'es/operations/CALL'},
		{ text: 'RET', link: 'es/operations/RET'},
		{ text: 'FIN', link: 'es/operations/FIN'},

		{ text: 'Ejemplos', header: true },
		{ text: 'Multiplicación', link: 'es/examples/multiplication'},
	],
};
