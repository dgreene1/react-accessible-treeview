import React, { useState } from "react";
import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import TreeView, { flattenTree } from "react-accessible-treeview";
import cx from "classnames";
import "./styles.css";

const countries = {
  name: "",
  children: [
    {
      name: "AFGHANISTAN",
      currencyCode: "971",
      currencyName: "AFGHANI",
    },
    {
      name: "ALAND ISLANDS",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "ALBANIA",
      currencyCode: "008",
      currencyName: "LEK",
    },
    {
      name: "ALGERIA",
      currencyCode: "012",
      currencyName: "ALGERIAN DINAR",
    },
    {
      name: "AMERICAN SAMOA",
      currencyCode: "840",
      currencyName: "US DOLLAR",
    },
    {
      name: "ANDORRA",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "ANGOLA",
      currencyCode: "973",
      currencyName: "ANGOLAN KWANZA",
    },
    {
      name: "ANGUILLA",
      currencyCode: "951",
      currencyName: "EAST CARRIBEAN DOLLAR",
    },
    {
      name: "ANTARCTICA",
      currencyCode: "578",
      currencyName: "NORWEGIAN KRONE",
    },
    {
      name: "ANTIGUA AND BARBUDA",
      currencyCode: "951",
      currencyName: "EAST CARRIBEAN DOLLAR",
    },
    {
      name: "ARGENTINA",
      currencyCode: "032",
      currencyName: "ARGENTINE PESO",
    },
    {
      name: "ARMENIA",
      currencyCode: "051",
      currencyName: "ARMENIAN DRAM",
    },
    {
      name: "ARUBA",
      currencyCode: "533",
      currencyName: "ARUBAN GUILDER",
    },
    {
      name: "AUSTRALIA",
      currencyCode: "036",
      currencyName: "AUSTRALIAN DOLLAR",
    },
    {
      name: "AUSTRIA",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "AZERBAIJAN",
      currencyCode: "944",
      currencyName: "AZERBAIJANIAN MANAT",
    },
    {
      name: "BAHAMAS",
      currencyCode: "044",
      currencyName: "BAHAMIAN DOLLAR",
    },
    {
      name: "BAHRAIN",
      currencyCode: "048",
      currencyName: "BAHRAINI DINAR",
    },
    {
      name: "BANGLADESH",
      currencyCode: "050",
      currencyName: "TAKA",
    },
    {
      name: "BARBADOS",
      currencyCode: "052",
      currencyName: "BARBADOS DOLLAR",
    },
    {
      name: "BELARUS",
      currencyCode: "933",
      currencyName: "BELARUSIAN RUBLE",
    },
    {
      name: "BELGIUM",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "BELIZE",
      currencyCode: "084",
      currencyName: "BELIZE DOLLAR",
    },
    {
      name: "BENIN",
      currencyCode: "952",
      currencyName: "CFA FRANC BCEAO",
    },
    {
      name: "BERMUDA",
      currencyCode: "060",
      currencyName: "BERMUDIAN DOLLAR",
    },
    {
      name: "BHUTAN",
      currencyCode: "064",
      currencyName: "BHUTANESE NGULTRUM",
    },
    {
      name: "BHUTAN",
      currencyCode: "356",
      currencyName: "INDIAN RUPEE",
    },
    {
      name: "BOLIVIA",
      currencyCode: "068",
      currencyName: "BOLIVIANO",
    },
    {
      name: "BONAIRE, SINT EUSTATIUS AND SABA",
      currencyCode: "840",
      currencyName: "US DOLLAR",
    },
    {
      name: "BOSNIA and HERZEGOVINA",
      currencyCode: "977",
      currencyName: "CONVERTIBLE MARK",
    },
    {
      name: "BOTSWANA",
      currencyCode: "072",
      currencyName: "PULA",
    },
    {
      name: "BOUVET ISLAND",
      currencyCode: "578",
      currencyName: "NORWEGIAN KRONE",
    },
    {
      name: "BRAZIL",
      currencyCode: "986",
      currencyName: "BRAZILIAN REAL",
    },
    {
      name: "BRAZIL",
      currencyCode: "996",
      currencyName: "SPANISH PESETA",
    },
    {
      name: "BRITISH INDIAN OCEAN TERRITORY",
      currencyCode: "840",
      currencyName: "US DOLLAR",
    },
    {
      name: "BRUNEI DARUSSALAM",
      currencyCode: "096",
      currencyName: "BRUNEI DOLLAR",
    },
    {
      name: "BULGARIA",
      currencyCode: "975",
      currencyName: "BULGARIAN LEV",
    },
    {
      name: "BURKINA FASO",
      currencyCode: "952",
      currencyName: "CFA FRANC BCEAO",
    },
    {
      name: "BURUNDI",
      currencyCode: "108",
      currencyName: "BURUNDI FRANC",
    },
    {
      name: "CAMBODIA",
      currencyCode: "116",
      currencyName: "RIEL",
    },
    {
      name: "CAMEROON",
      currencyCode: "950",
      currencyName: "CFA FRANC BEAC",
    },
    {
      name: "CANADA",
      currencyCode: "124",
      currencyName: "CANADIAN DOLLAR",
    },
    {
      name: "CAPE VERDE",
      currencyCode: "132",
      currencyName: "CAPE VERDE ESCUDO",
    },
    {
      name: "CAYMAN ISLANDS",
      currencyCode: "136",
      currencyName: "CAYMAN ISLANDS DOLLAR",
    },
    {
      name: "CENTRAL AFRICAN REPUBLIC",
      currencyCode: "950",
      currencyName: "CFA FRANC BEAC",
    },
    {
      name: "CHAD",
      currencyCode: "950",
      currencyName: "CFA FRANC BEAC",
    },
    {
      name: "CHILE",
      currencyCode: "152",
      currencyName: "CHILEAN PESO",
    },
    {
      name: "CHINA",
      currencyCode: "156",
      currencyName: "CHINESE YUAN RENMINBI",
    },
    {
      name: "CHINA",
      currencyCode: "158",
      currencyName: "CHINESE PEOPLE'S BANK",
    },
    {
      name: "CHRISTMAS ISLAND",
      currencyCode: "036",
      currencyName: "AUSTRALIAN DOLLAR",
    },
    {
      name: "COCOS (KEELING) ISLANDS",
      currencyCode: "036",
      currencyName: "AUSTRALIAN DOLLAR",
    },
    {
      name: "COLOMBIA",
      currencyCode: "170",
      currencyName: "COLOMBIAN PESO",
    },
    {
      name: "COMOROS",
      currencyCode: "174",
      currencyName: "COMORO FRANC",
    },
    {
      name: "CONGO",
      currencyCode: "950",
      currencyName: "CFA FRANC BEAC",
    },
    {
      name: "COOK ISLANDS",
      currencyCode: "554",
      currencyName: "NEW ZEALAND DOLLAR",
    },
    {
      name: "COSTA RICA",
      currencyCode: "188",
      currencyName: "COSTA RICAN COLON",
    },
    {
      name: "COTE D’IVOIRE (IVORY COAST)",
      currencyCode: "952",
      currencyName: "CFA FRANC BCEAO",
    },
    {
      name: "CROATIA",
      currencyCode: "191",
      currencyName: "CROATIAN KUNA",
    },
    {
      name: "CURACAO",
      currencyCode: "532",
      currencyName: "NETHERLANDS ANTILLEAN",
    },
    {
      name: "CYPRUS",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "CZECH REPUBLIC",
      currencyCode: "203",
      currencyName: "CZECH KORUNA",
    },
    {
      name: "DEMOCRATIC REPUBLIC OF THE CONGO",
      currencyCode: "976",
      currencyName: "CONGOLESE",
    },
    {
      name: "DENMARK",
      currencyCode: "208",
      currencyName: "DANISH KRONE",
    },
    {
      name: "DJIBOUTI",
      currencyCode: "262",
      currencyName: "DJIBOUTI FRANC",
    },
    {
      name: "DOMINICA",
      currencyCode: "951",
      currencyName: "EAST CARRIBEAN DOLLAR",
    },
    {
      name: "DOMINICAN REPUBLIC",
      currencyCode: "214",
      currencyName: "DOMINICAN PESO",
    },
    {
      name: "EGYPT",
      currencyCode: "818",
      currencyName: "EGYPTIAN POUND",
    },
    {
      name: "EL SALVADOR",
      currencyCode: "222",
      currencyName: "EL SALVADOR COLON",
    },
    {
      name: "ECUADOR",
      currencyCode: "840",
      currencyName: "US DOLLAR",
    },
    {
      name: "EQUATORIAL GUINEA",
      currencyCode: "950",
      currencyName: "CFA FRANC BEAC",
    },
    {
      name: "ERITREA",
      currencyCode: "230",
      currencyName: "ETHIOPIAN BIRR",
    },
    {
      name: "ERITREA",
      currencyCode: "232",
      currencyName: "ERITREAN NAKFA",
    },
    {
      name: "ESTONIA",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "ETHIOPIA",
      currencyCode: "230",
      currencyName: "ETHIOPIAN BIRR",
    },
    {
      name: "FALKLAND ISLANDS (MALVINAS)",
      currencyCode: "238",
      currencyName: "FALKLAND ISLANDS POUND",
    },
    {
      name: "FEDERATED STATES OF MICRONESIA",
      currencyCode: "840",
      currencyName: "US",
    },
    {
      name: "FIJI",
      currencyCode: "242",
      currencyName: "FIJI DOLLAR",
    },
    {
      name: "FINLAND",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "FRANCE",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "FRANCE, METROPOLITAN",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "FRENCH GUIANA",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "FRENCH POLYNESIA",
      currencyCode: "953",
      currencyName: "CFP FRANC",
    },
    {
      name: "GABON",
      currencyCode: "950",
      currencyName: "CFA FRANC BEAC",
    },
    {
      name: "GAMBIA",
      currencyCode: "270",
      currencyName: "DALASI",
    },
    {
      name: "GEORGIA",
      currencyCode: "981",
      currencyName: "LARI",
    },
    {
      name: "GERMANY",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "GHANA",
      currencyCode: "936",
      currencyName: "CEDI",
    },
    {
      name: "GIBRALTAR",
      currencyCode: "292",
      currencyName: "GIBRALTAR POUND",
    },
    {
      name: "GREECE",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "GREENLAND",
      currencyCode: "208",
      currencyName: "DANISH KRONE",
    },
    {
      name: "GRENADA",
      currencyCode: "951",
      currencyName: "EAST CARRIBEAN DOLLAR",
    },
    {
      name: "GUADELOUPE",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "GUAM",
      currencyCode: "840",
      currencyName: "US DOLLAR",
    },
    {
      name: "GUATEMALA",
      currencyCode: "320",
      currencyName: "QUETZAL",
    },
    {
      name: "GUINEA-BISSAU",
      currencyCode: "952",
      currencyName: "CFA FRANC BCEAO",
    },
    {
      name: "GUINEA",
      currencyCode: "324",
      currencyName: "GUINEA FRANC",
    },
    {
      name: "GUYANA",
      currencyCode: "328",
      currencyName: "GUYANA DOLLAR",
    },
    {
      name: "HAITI",
      currencyCode: "332",
      currencyName: "GOURDE",
    },
    {
      name: "HEARD and MCDONALD ISLANDS",
      currencyCode: "036",
      currencyName: "AUSTRALIAN DOLLAR",
    },
    {
      name: "HOLY SEE (VATICAN CITY STATE)",
      currencyCode: "",
      currencyName: "978",
    },
    {
      name: "HONDURUS",
      currencyCode: "340",
      currencyName: "LEMPIRA",
    },
    {
      name: "HONG KONG",
      currencyCode: "344",
      currencyName: "HONG KONG DOLLAR",
    },
    {
      name: "HUNGARY",
      currencyCode: "348",
      currencyName: "FORINT",
    },
    {
      name: "ICELAND",
      currencyCode: "352",
      currencyName: "ICELANDIC KRONA",
    },
    {
      name: "INDIA",
      currencyCode: "356",
      currencyName: "INDIAN RUPEE",
    },
    {
      name: "INDONESIA",
      currencyCode: "360",
      currencyName: "RUPIAH",
    },
    {
      name: "IRAQ",
      currencyCode: "368",
      currencyName: "IRAQI DINAR",
    },
    {
      name: "ISRAEL",
      currencyCode: "376",
      currencyName: "NEW ISRAELI SHEKEL",
    },
    {
      name: "IRELAND",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "ISLE OF MAN",
      currencyCode: "826",
      currencyName: "POUND STERLING",
    },
    {
      name: "ITALY",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "JAMAICA",
      currencyCode: "388",
      currencyName: "JAMAICAN DOLLAR",
    },
    {
      name: "JAPAN",
      currencyCode: "392",
      currencyName: "YEN",
    },
    {
      name: "JERSEY",
      currencyCode: "826",
      currencyName: "POUND STERLING",
    },
    {
      name: "JORDAN",
      currencyCode: "400",
      currencyName: "JORDANIAN DINAR",
    },
    {
      name: "KAZAKHSTAN",
      currencyCode: "398",
      currencyName: "TENGE",
    },
    {
      name: "KENYA",
      currencyCode: "404",
      currencyName: "KENYAN SHILLING",
    },
    {
      name: "KIRIBATI",
      currencyCode: "036",
      currencyName: "AUSTRALIAN DOLLAR",
    },
    {
      name: "KOREA, REPUBLIC OF",
      currencyCode: "410",
      currencyName: "WON",
    },
    {
      name: "KUWAIT",
      currencyCode: "414",
      currencyName: "KUWAITI DINAR",
    },
    {
      name: "KYRGYZSTAN",
      currencyCode: "417",
      currencyName: "SOM",
    },
    {
      name: "LAO PEOPLE'S DEMOCRATIC REPUBLIC",
      currencyCode: "418",
      currencyName: "KIP",
    },
    {
      name: "LATVIA",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "LEBANON",
      currencyCode: "422",
      currencyName: "LEBANESE POUND",
    },
    {
      name: "LESOTHO",
      currencyCode: "426",
      currencyName: "LOTI",
    },
    {
      name: "LESOTHO",
      currencyCode: "710",
      currencyName: "RAND",
    },
    {
      name: "LIBERIA",
      currencyCode: "430",
      currencyName: "LIBERIAN DOLLAR",
    },
    {
      name: "LIBYAN ARAB JAMAHIRIYA",
      currencyCode: "434",
      currencyName: "LIBYAN DINAR",
    },
    {
      name: "LIECHTENSTEIN",
      currencyCode: "756",
      currencyName: "SWISS FRANC",
    },
    {
      name: "LITHUANIA",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "LUXEMBOURG",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "MACAO",
      currencyCode: "446",
      currencyName: "PATACA",
    },
    {
      name: "MACEDONIA",
      currencyCode: "807",
      currencyName: "DENAR",
    },
    {
      name: "MADAGASCAR",
      currencyCode: "969",
      currencyName: "MALAGASY ARIARY",
    },
    {
      name: "MALAWI",
      currencyCode: "454",
      currencyName: "MALAWI KWACHA",
    },
    {
      name: "MALAYSIA",
      currencyCode: "458",
      currencyName: "MALAYSIAN RINGGIT",
    },
    {
      name: "MALDIVES",
      currencyCode: "462",
      currencyName: "RUFIYAA",
    },
    {
      name: "MALI",
      currencyCode: "952",
      currencyName: "CFA FRANC BCEAO",
    },
    {
      name: "MALTA",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "MARSHALL ISLANDS",
      currencyCode: "840",
      currencyName: "US DOLLAR",
    },
    {
      name: "MARTINIQUE",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "MAURITANIA",
      currencyCode: "929",
      currencyName: "OUGUIYA",
    },
    {
      name: "MAURITIUS",
      currencyCode: "480",
      currencyName: "MAURITIUS RUPEE",
    },
    {
      name: "MAYOTTE",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "MEXICO",
      currencyCode: "484",
      currencyName: "MEXICAN PESO",
    },
    {
      name: "MOLDOVA, REPUBLIC OF",
      currencyCode: "498",
      currencyName: "MOLDOVAN LEU",
    },
    {
      name: "MONACO",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "MONGOLIA",
      currencyCode: "496",
      currencyName: "TUGRIK",
    },
    {
      name: "MONTENEGRO, REPUBLIC OF",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "MONTSERRAT",
      currencyCode: "951",
      currencyName: "EAST CARRIBEAN DOLLAR",
    },
    {
      name: "MOROCCO",
      currencyCode: "002",
      currencyName: "MOROCCAN DIRHAM",
    },
    {
      name: "MOZAMBIQUE",
      currencyCode: "943",
      currencyName: "MOZAMBIQUE METICAL",
    },
    {
      name: "MYANMAR",
      currencyCode: "104",
      currencyName: "MYANMAR KYAT",
    },
    {
      name: "NAMIBIA",
      currencyCode: "516",
      currencyName: "NAMIBIAN DOLLAR",
    },
    {
      name: "NAURU",
      currencyCode: "036",
      currencyName: "AUSTRALIAN DOLLAR",
    },
    {
      name: "NEPAL",
      currencyCode: "524",
      currencyName: "NEPALESE RUPEE",
    },
    {
      name: "NETHERLANDS",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "NETHERLANDS ANTILLES",
      currencyCode: "532",
      currencyName: "NETHLANDES ANTILLIAN",
    },
    {
      name: "NEW CALEDONIA",
      currencyCode: "953",
      currencyName: "CFP FRANC",
    },
    {
      name: "NEW ZEALAND",
      currencyCode: "554",
      currencyName: "NEW ZEALAND DOLLAR",
    },
    {
      name: "NICARAGUA",
      currencyCode: "558",
      currencyName: "CORDOBA ORO",
    },
    {
      name: "NIGER",
      currencyCode: "952",
      currencyName: "CFA FRANC BCEAO",
    },
    {
      name: "NIGERIA",
      currencyCode: "566",
      currencyName: "NAIRA",
    },
    {
      name: "NIUE",
      currencyCode: "554",
      currencyName: "NEW ZEALAND DOLLAR",
    },
    {
      name: "NORFOLK ISLAND",
      currencyCode: "036",
      currencyName: "AUSTRALIAN DOLLAR",
    },
    {
      name: "NORTHERN MARIANA ISLANDS",
      currencyCode: "840",
      currencyName: "US DOLLAR",
    },
    {
      name: "NORWAY",
      currencyCode: "578",
      currencyName: "NORWEGIAN KRONE",
    },
    {
      name: "OMAN",
      currencyCode: "512",
      currencyName: "RIAL OMANI",
    },
    {
      name: "PAKISTAN",
      currencyCode: "586",
      currencyName: "PAKISTAN RUPEE",
    },
    {
      name: "PALAU",
      currencyCode: "840",
      currencyName: "US DOLLAR",
    },
    {
      name: "PANAMA",
      currencyCode: "590",
      currencyName: "BALBOA",
    },
    {
      name: "PAPUA NEW GUINEA",
      currencyCode: "598",
      currencyName: "KINA",
    },
    {
      name: "PARAGUAY",
      currencyCode: "600",
      currencyName: "GUARANI",
    },
    {
      name: "PERU",
      currencyCode: "604",
      currencyName: "NUEVO SOL",
    },
    {
      name: "PHILIPPINES",
      currencyCode: "608",
      currencyName: "PHILIPPINE PESO",
    },
    {
      name: "PITCAIRN",
      currencyCode: "554",
      currencyName: "NEW ZEALAND DOLLAR",
    },
    {
      name: "POLAND",
      currencyCode: "985",
      currencyName: "ZLOTY",
    },
    {
      name: "PORTUGAL",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "PUERTO RICO",
      currencyCode: "840",
      currencyName: "US DOLLAR",
    },
    {
      name: "QATAR",
      currencyCode: "634",
      currencyName: "QATARI RIAL",
    },
    {
      name: "REUNION",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "ROMANIA",
      currencyCode: "946",
      currencyName: "ROMANIAN LEU",
    },
    {
      name: "RUSSIAN FEDERATION",
      currencyCode: "643",
      currencyName: "RUSSIAN RUBLE",
    },
    {
      name: "RWANDA",
      currencyCode: "646",
      currencyName: "RWANDA FRANC",
    },
    {
      name: "SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA",
      currencyCode: "654",
      currencyName: "ST. HELENA",
    },
    {
      name: "SAMOA",
      currencyCode: "882",
      currencyName: "TALA",
    },
    {
      name: "SAN MARINO",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "SAO TOME AND PRINCIPE",
      currencyCode: "930",
      currencyName: "DOBRA",
    },
    {
      name: "SAUDI ARABIA",
      currencyCode: "682",
      currencyName: "SAUDI RIYAL",
    },
    {
      name: "SENEGAL",
      currencyCode: "952",
      currencyName: "CFA FRANC BCEAO",
    },
    {
      name: "SERBIA",
      currencyCode: "941",
      currencyName: "SERBIAN DINAR",
    },
    {
      name: "SEYCHELLES",
      currencyCode: "690",
      currencyName: "SEYCHELLES RUPEE",
    },
    {
      name: "SIERRA LEONE",
      currencyCode: "694",
      currencyName: "LEONE",
    },
    {
      name: "SINGAPORE",
      currencyCode: "702",
      currencyName: "SINGAPORE DOLLAR",
    },
    {
      name: "SINT MAARTEN (DUTCH PART)",
      currencyCode: "532",
      currencyName: "NETHERLANDS ANTILLES",
    },
    {
      name: "SLOVAKIA",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "SLOVENIA",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "SOLOMON ISLANDS",
      currencyCode: "090",
      currencyName: "SOLOMON ISLANDS DOLLAR",
    },
    {
      name: "SOMALIA",
      currencyCode: "706",
      currencyName: "SOMALI SHILLING",
    },
    {
      name: "SOUTH AFRICA",
      currencyCode: "710",
      currencyName: "RAND",
    },
    {
      name: "SOUTH SUDAN",
      currencyCode: "728",
      currencyName: "SOUTH SUDANESE POUND",
    },
    {
      name: "SPAIN",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "SRI LANKA",
      currencyCode: "144",
      currencyName: "SRI LANKA RUPEE",
    },
    {
      name: "ST. KITTS-NEVIS",
      currencyCode: "951",
      currencyName: "EAST CARRIBEAN DOLLAR",
    },
    {
      name: "ST. LUCIA",
      currencyCode: "951",
      currencyName: "EAST CARRIBEAN DOLLAR",
    },
    {
      name: "ST. PIERRE AND MIQUELON",
      currencyCode: "978",
      currencyName: "EURO",
    },
    {
      name: "ST. VINCENT AND THE GRENADINES",
      currencyCode: "951",
      currencyName: "EAST CARRIBEAN",
    },
    {
      name: "SURINAME",
      currencyCode: "968",
      currencyName: "SURINAME DOLLAR",
    },
    {
      name: "SVALBARD AND JAN MAYEN",
      currencyCode: "578",
      currencyName: "NORWEGIAN KRONE",
    },
    {
      name: "SWITZERLAND",
      currencyCode: "756",
      currencyName: "SWISS FRANC",
    },
    {
      name: "SWAZILAND",
      currencyCode: "748",
      currencyName: "LILANGENI",
    },
    {
      name: "SWEDEN",
      currencyCode: "752",
      currencyName: "SWEDISH KRONA",
    },
    {
      name: "TAIWAN",
      currencyCode: "901",
      currencyName: "NEW TAIWAN DOLLAR",
    },
    {
      name: "TAJIKISTAN",
      currencyCode: "972",
      currencyName: "SOMONI",
    },
    {
      name: "TANZANIA, UNITED REPUBLIC OF",
      currencyCode: "834",
      currencyName: "TANZANIAN",
    },
    {
      name: "THAILAND",
      currencyCode: "764",
      currencyName: "BAHT",
    },
    {
      name: "TIMOR-LESTE",
      currencyCode: "840",
      currencyName: "US DOLLAR",
    },
    {
      name: "TOGO",
      currencyCode: "952",
      currencyName: "CFA FRANC BCEAO",
    },
    {
      name: "TOKELAU",
      currencyCode: "554",
      currencyName: "NEW ZEALAND DOLLAR",
    },
    {
      name: "TONGA",
      currencyCode: "776",
      currencyName: "PA'ANGA",
    },
    {
      name: "TRINIDAD AND TOBAGO",
      currencyCode: "780",
      currencyName: "TRINIDAD AND TOBAGO",
    },
    {
      name: "TUNISIA",
      currencyCode: "788",
      currencyName: "TUNISIAN DINAR",
    },
    {
      name: "TURKEY",
      currencyCode: "949",
      currencyName: "TURKISH LIRA",
    },
    {
      name: "TURKMENISTAN",
      currencyCode: "934",
      currencyName: "MANAT",
    },
    {
      name: "TURKS and CAICOS ISLANDS",
      currencyCode: "840",
      currencyName: "US DOLLAR",
    },
    {
      name: "TUVALU",
      currencyCode: "036",
      currencyName: "AUSTRALIAN DOLLAR",
    },
    {
      name: "UGANDA",
      currencyCode: "800",
      currencyName: "UGANDAN SHILLING",
    },
    {
      name: "UKRAINE",
      currencyCode: "980",
      currencyName: "UKRAINIAN HRYVNIA",
    },
    {
      name: "UNITED ARAB EMIRATES",
      currencyCode: "784",
      currencyName: "U.A.E. DIRHAM",
    },
    {
      name: "UNITED KINGDOM",
      currencyCode: "826",
      currencyName: "POUND STERLING",
    },
    {
      name: "UNITED STATES",
      currencyCode: "840",
      currencyName: "US DOLLAR",
    },
    {
      name: "URUGUAY",
      currencyCode: "858",
      currencyName: "PESO URUGUAYO",
    },
    {
      name: "UZBEKISTAN",
      currencyCode: "860",
      currencyName: "UZBEKISTAN SUM",
    },
    {
      name: "VANUATU",
      currencyCode: "548",
      currencyName: "VATU",
    },
    {
      name: "VENEZUELA",
      currencyCode: "928",
      currencyName: "BOLIVAR SOBERANO",
    },
    {
      name: "VIETNAM",
      currencyCode: "704",
      currencyName: "DONG",
    },
    {
      name: "BRITISH VIRGIN ISLANDS",
      currencyCode: "840",
      currencyName: "US DOLLAR",
    },
    {
      name: "U.S. VIRGIN ISLANDS",
      currencyCode: "840",
      currencyName: "US DOLLAR",
    },
    {
      name: "WALLIS AND FUTUNA ISLANDS",
      currencyCode: "953",
      currencyName: "CFP FRANC",
    },
    {
      name: "WESTERN SAHARA",
      currencyCode: "504",
      currencyName: "MOROCCAN DIRHAM",
    },
    {
      name: "YEMEN",
      currencyCode: "886",
      currencyName: "YEMENI RIAL",
    },
    {
      name: "ZAMBIA",
      currencyCode: "967",
      currencyName: "ZAMBIAN KWACHA",
    },
    {
      name: "ZIMBABWE",
      currencyCode: "716",
      currencyName: "ZIMBABWE DOLLAR",
    },
    {
      name: "CUBA",
      currencyCode: "192",
      currencyName: "CUBAN PESO",
    },
    {
      name: "ECUADOR",
      currencyCode: "218",
      currencyName: "SUCRE",
    },
    {
      name: "IRAN",
      currencyCode: "364",
      currencyName: "IRANIAN RIAL",
    },
    {
      name: "LATVIA",
      currencyCode: "428",
      currencyName: "LATVIAN LATS",
    },
    {
      name: "LITHUANIA",
      currencyCode: "440",
      currencyName: "LITHUANIAN LITAS",
    },
    {
      name: "GUINEA-BISSAU",
      currencyCode: "624",
      currencyName: "GUINEA-BISSAU PESO",
    },
    {
      name: "SYRIA",
      currencyCode: "760",
      currencyName: "SYRIAN POUND",
    },
    {
      name: "TONGA",
      currencyCode: "776",
      currencyName: "PA’ANGA",
    },
  ],
};

const data = flattenTree(countries);

function Filtering() {
  const [treeData, setTreeData] = useState(data);

  const filter = (value) => {
    const filtered = [];
    const includeChildren = (id) => {
      data.forEach((item) => {
        if (item.parent === id) {
          if (!filtered.find((x) => x.id === item.id)) {
            filtered.push(item);
          }
          if (item.children.length) {
            includeChildren(item.id);
          }
        }
      });
    };
    data.forEach((item) => {
      if (item.id === "ROOT") {
        return;
      }
      if (item.name.includes(value.toUpperCase())) {
        if (!filtered.find((x) => x.id === item.id)) {
          filtered.push(item);
        }

        if (item.children.length) {
          includeChildren(item.id);
        }
      }
    });
    filtered.unshift(
      Object.assign({
        ...data[0],
        children: data[0].children.filter((id) =>
          filtered.find((fitem) => fitem.id === id)
        ),
      })
    );
    setTreeData(filtered);
  };

  const filterNodesByText = () => {
    const valueToFilter = document.querySelector("#txtToFilter").value.trim();
    if (!!valueToFilter) {
      filter(valueToFilter);
    } else {
      setTreeData(data);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      filterNodesByText();
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="txtToFilter">Text to filter: </label>
        <input id="txtToFilter" type="text" onKeyDown={onKeyDown} />
        <button onClick={() => filterNodesByText()}>Apply</button>
      </div>
      {treeData.length === 1 ? (
        <div>No nodes match filter</div>
      ) : (
      <div className="filtered">
        <TreeView
          data={treeData}
          aria-label="Filtered tree"
          multiSelect
          propagateSelect
          propagateSelectUpwards
          togglableSelect
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            isSelected,
            isHalfSelected,
            getNodeProps,
            level,
            handleSelect,
            handleExpand,
          }) => {
            return (
              <div
                {...getNodeProps({ onClick: handleExpand })}
                style={{ marginLeft: 40 * (level - 1) }}
              >
                <div style={{ marginLeft: isBranch ? "0" : "21px" }}>
                  {isBranch && <ArrowIcon isOpen={isExpanded} />}
                  <CheckBoxIcon
                    className="checkbox-icon"
                    onClick={(e) => {
                      handleSelect(e);
                      e.stopPropagation();
                    }}
                    variant={
                      isHalfSelected ? "some" : isSelected ? "all" : "none"
                    }
                  />
                  <span className="name">{element.name}</span>
                </div>
              </div>
            );
          }}
        />
      </div>
      )}
    </div>
  );
}

const ArrowIcon = ({ isOpen, className }) => {
  const baseClass = "arrow";
  const classes = cx(
    baseClass,
    { [`${baseClass}--closed`]: !isOpen },
    { [`${baseClass}--open`]: isOpen },
    className
  );
  return <IoMdArrowDropright className={classes} />;
};

const CheckBoxIcon = ({ variant, ...rest }) => {
  switch (variant) {
    case "all":
      return <FaCheckSquare {...rest} />;
    case "none":
      return <FaSquare {...rest} />;
    case "some":
      return <FaMinusSquare {...rest} />;
    default:
      return null;
  }
};

export default Filtering;
