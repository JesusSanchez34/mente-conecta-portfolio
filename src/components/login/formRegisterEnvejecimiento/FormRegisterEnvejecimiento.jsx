import { useFormik } from 'formik';
import React, { useState, useEffect, useRef } from 'react';
import { Spinner } from 'react-bootstrap';
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiGlobe } from 'react-icons/fi';
import logoColor from "../../../assets/img/logoColor.png";
import { registerApiEnvejecimiento, loginApiEnvejecimiento } from '../../../api/user';
import { useAuth } from '../../../hooks';
import { useSettings } from '../../../context/SettingsContext';
import './FormRegisterEnvejecimiento.css';

export function getFlagEmoji(code) {
    return code.toUpperCase().replace(/./g, c =>
        String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)
    );
}

export const countriesData = [
    { code: 'af', nameEs: 'Afganistán', nameEn: 'Afghanistan', dial_code: '+93', maxLength: 9 },
    { code: 'al', nameEs: 'Albania', nameEn: 'Albania', dial_code: '+355', maxLength: 9 },
    { code: 'de', nameEs: 'Alemania', nameEn: 'Germany', dial_code: '+49', maxLength: 11 },
    { code: 'ad', nameEs: 'Andorra', nameEn: 'Andorra', dial_code: '+376', maxLength: 6 },
    { code: 'ao', nameEs: 'Angola', nameEn: 'Angola', dial_code: '+244', maxLength: 9 },
    { code: 'ai', nameEs: 'Anguila', nameEn: 'Anguilla', dial_code: '+1264', maxLength: 7 },
    { code: 'ag', nameEs: 'Antigua y Barbuda', nameEn: 'Antigua and Barbuda', dial_code: '+1268', maxLength: 7 },
    { code: 'sa', nameEs: 'Arabia Saudí', nameEn: 'Saudi Arabia', dial_code: '+966', maxLength: 9 },
    { code: 'dz', nameEs: 'Argelia', nameEn: 'Algeria', dial_code: '+213', maxLength: 9 },
    { code: 'ar', nameEs: 'Argentina', nameEn: 'Argentina', dial_code: '+54', maxLength: 10 },
    { code: 'am', nameEs: 'Armenia', nameEn: 'Armenia', dial_code: '+374', maxLength: 8 },
    { code: 'aw', nameEs: 'Aruba', nameEn: 'Aruba', dial_code: '+297', maxLength: 7 },
    { code: 'au', nameEs: 'Australia', nameEn: 'Australia', dial_code: '+61', maxLength: 9 },
    { code: 'at', nameEs: 'Austria', nameEn: 'Austria', dial_code: '+43', maxLength: 10 },
    { code: 'az', nameEs: 'Azerbaiyán', nameEn: 'Azerbaijan', dial_code: '+994', maxLength: 9 },
    { code: 'bs', nameEs: 'Bahamas', nameEn: 'Bahamas', dial_code: '+1242', maxLength: 7 },
    { code: 'bh', nameEs: 'Baréin', nameEn: 'Bahrain', dial_code: '+973', maxLength: 8 },
    { code: 'bd', nameEs: 'Bangladés', nameEn: 'Bangladesh', dial_code: '+880', maxLength: 10 },
    { code: 'bb', nameEs: 'Barbados', nameEn: 'Barbados', dial_code: '+1246', maxLength: 7 },
    { code: 'be', nameEs: 'Bélgica', nameEn: 'Belgium', dial_code: '+32', maxLength: 9 },
    { code: 'bz', nameEs: 'Belice', nameEn: 'Belize', dial_code: '+501', maxLength: 7 },
    { code: 'bj', nameEs: 'Benín', nameEn: 'Benin', dial_code: '+229', maxLength: 8 },
    { code: 'by', nameEs: 'Bielorrusia', nameEn: 'Belarus', dial_code: '+375', maxLength: 9 },
    { code: 'bo', nameEs: 'Bolivia', nameEn: 'Bolivia', dial_code: '+591', maxLength: 8 },
    { code: 'ba', nameEs: 'Bosnia y Herzegovina', nameEn: 'Bosnia and Herzegovina', dial_code: '+387', maxLength: 8 },
    { code: 'bw', nameEs: 'Botsuana', nameEn: 'Botswana', dial_code: '+267', maxLength: 8 },
    { code: 'br', nameEs: 'Brasil', nameEn: 'Brazil', dial_code: '+55', maxLength: 11 },
    { code: 'bn', nameEs: 'Brunéi', nameEn: 'Brunei', dial_code: '+673', maxLength: 7 },
    { code: 'bg', nameEs: 'Bulgaria', nameEn: 'Bulgaria', dial_code: '+359', maxLength: 9 },
    { code: 'bf', nameEs: 'Burkina Faso', nameEn: 'Burkina Faso', dial_code: '+226', maxLength: 8 },
    { code: 'bi', nameEs: 'Burundi', nameEn: 'Burundi', dial_code: '+257', maxLength: 8 },
    { code: 'bt', nameEs: 'Bután', nameEn: 'Bhutan', dial_code: '+975', maxLength: 8 },
    { code: 'cv', nameEs: 'Cabo Verde', nameEn: 'Cape Verde', dial_code: '+238', maxLength: 7 },
    { code: 'kh', nameEs: 'Camboya', nameEn: 'Cambodia', dial_code: '+855', maxLength: 9 },
    { code: 'cm', nameEs: 'Camerún', nameEn: 'Cameroon', dial_code: '+237', maxLength: 9 },
    { code: 'ca', nameEs: 'Canadá', nameEn: 'Canada', dial_code: '+1', maxLength: 10 },
    { code: 'qa', nameEs: 'Catar', nameEn: 'Qatar', dial_code: '+974', maxLength: 8 },
    { code: 'td', nameEs: 'Chad', nameEn: 'Chad', dial_code: '+235', maxLength: 8 },
    { code: 'cl', nameEs: 'Chile', nameEn: 'Chile', dial_code: '+56', maxLength: 9 },
    { code: 'cn', nameEs: 'China', nameEn: 'China', dial_code: '+86', maxLength: 11 },
    { code: 'cy', nameEs: 'Chipre', nameEn: 'Cyprus', dial_code: '+357', maxLength: 8 },
    { code: 'co', nameEs: 'Colombia', nameEn: 'Colombia', dial_code: '+57', maxLength: 10 },
    { code: 'km', nameEs: 'Comoras', nameEn: 'Comoros', dial_code: '+269', maxLength: 7 },
    { code: 'cg', nameEs: 'Congo', nameEn: 'Congo', dial_code: '+242', maxLength: 9 },
    { code: 'cd', nameEs: 'Congo (RDC)', nameEn: 'Congo (DRC)', dial_code: '+243', maxLength: 9 },
    { code: 'kp', nameEs: 'Corea del Norte', nameEn: 'North Korea', dial_code: '+850', maxLength: 10 },
    { code: 'kr', nameEs: 'Corea del Sur', nameEn: 'South Korea', dial_code: '+82', maxLength: 10 },
    { code: 'ci', nameEs: 'Costa de Marfil', nameEn: 'Ivory Coast', dial_code: '+225', maxLength: 10 },
    { code: 'cr', nameEs: 'Costa Rica', nameEn: 'Costa Rica', dial_code: '+506', maxLength: 8 },
    { code: 'hr', nameEs: 'Croacia', nameEn: 'Croatia', dial_code: '+385', maxLength: 9 },
    { code: 'cu', nameEs: 'Cuba', nameEn: 'Cuba', dial_code: '+53', maxLength: 8 },
    { code: 'dk', nameEs: 'Dinamarca', nameEn: 'Denmark', dial_code: '+45', maxLength: 8 },
    { code: 'dm', nameEs: 'Dominica', nameEn: 'Dominica', dial_code: '+1767', maxLength: 7 },
    { code: 'ec', nameEs: 'Ecuador', nameEn: 'Ecuador', dial_code: '+593', maxLength: 9 },
    { code: 'eg', nameEs: 'Egipto', nameEn: 'Egypt', dial_code: '+20', maxLength: 10 },
    { code: 'sv', nameEs: 'El Salvador', nameEn: 'El Salvador', dial_code: '+503', maxLength: 8 },
    { code: 'ae', nameEs: 'Emiratos Árabes Unidos', nameEn: 'United Arab Emirates', dial_code: '+971', maxLength: 9 },
    { code: 'er', nameEs: 'Eritrea', nameEn: 'Eritrea', dial_code: '+291', maxLength: 7 },
    { code: 'sk', nameEs: 'Eslovaquia', nameEn: 'Slovakia', dial_code: '+421', maxLength: 9 },
    { code: 'si', nameEs: 'Eslovenia', nameEn: 'Slovenia', dial_code: '+386', maxLength: 8 },
    { code: 'es', nameEs: 'España', nameEn: 'Spain', dial_code: '+34', maxLength: 9 },
    { code: 'us', nameEs: 'Estados Unidos', nameEn: 'United States', dial_code: '+1', maxLength: 10 },
    { code: 'ee', nameEs: 'Estonia', nameEn: 'Estonia', dial_code: '+372', maxLength: 8 },
    { code: 'et', nameEs: 'Etiopía', nameEn: 'Ethiopia', dial_code: '+251', maxLength: 9 },
    { code: 'ph', nameEs: 'Filipinas', nameEn: 'Philippines', dial_code: '+63', maxLength: 10 },
    { code: 'fi', nameEs: 'Finlandia', nameEn: 'Finland', dial_code: '+358', maxLength: 9 },
    { code: 'fj', nameEs: 'Fiyi', nameEn: 'Fiji', dial_code: '+679', maxLength: 7 },
    { code: 'fr', nameEs: 'Francia', nameEn: 'France', dial_code: '+33', maxLength: 9 },
    { code: 'ga', nameEs: 'Gabón', nameEn: 'Gabon', dial_code: '+241', maxLength: 7 },
    { code: 'gm', nameEs: 'Gambia', nameEn: 'Gambia', dial_code: '+220', maxLength: 7 },
    { code: 'ge', nameEs: 'Georgia', nameEn: 'Georgia', dial_code: '+995', maxLength: 9 },
    { code: 'gh', nameEs: 'Ghana', nameEn: 'Ghana', dial_code: '+233', maxLength: 9 },
    { code: 'gr', nameEs: 'Grecia', nameEn: 'Greece', dial_code: '+30', maxLength: 10 },
    { code: 'gd', nameEs: 'Granada', nameEn: 'Grenada', dial_code: '+1473', maxLength: 7 },
    { code: 'gt', nameEs: 'Guatemala', nameEn: 'Guatemala', dial_code: '+502', maxLength: 8 },
    { code: 'gn', nameEs: 'Guinea', nameEn: 'Guinea', dial_code: '+224', maxLength: 9 },
    { code: 'gq', nameEs: 'Guinea Ecuatorial', nameEn: 'Equatorial Guinea', dial_code: '+240', maxLength: 9 },
    { code: 'gw', nameEs: 'Guinea-Bisáu', nameEn: 'Guinea-Bissau', dial_code: '+245', maxLength: 7 },
    { code: 'gy', nameEs: 'Guyana', nameEn: 'Guyana', dial_code: '+592', maxLength: 7 },
    { code: 'ht', nameEs: 'Haití', nameEn: 'Haiti', dial_code: '+509', maxLength: 8 },
    { code: 'hn', nameEs: 'Honduras', nameEn: 'Honduras', dial_code: '+504', maxLength: 8 },
    { code: 'hk', nameEs: 'Hong Kong', nameEn: 'Hong Kong', dial_code: '+852', maxLength: 8 },
    { code: 'hu', nameEs: 'Hungría', nameEn: 'Hungary', dial_code: '+36', maxLength: 9 },
    { code: 'in', nameEs: 'India', nameEn: 'India', dial_code: '+91', maxLength: 10 },
    { code: 'id', nameEs: 'Indonesia', nameEn: 'Indonesia', dial_code: '+62', maxLength: 10 },
    { code: 'iq', nameEs: 'Irak', nameEn: 'Iraq', dial_code: '+964', maxLength: 10 },
    { code: 'ir', nameEs: 'Irán', nameEn: 'Iran', dial_code: '+98', maxLength: 10 },
    { code: 'ie', nameEs: 'Irlanda', nameEn: 'Ireland', dial_code: '+353', maxLength: 9 },
    { code: 'is', nameEs: 'Islandia', nameEn: 'Iceland', dial_code: '+354', maxLength: 7 },
    { code: 'ky', nameEs: 'Islas Caimán', nameEn: 'Cayman Islands', dial_code: '+1345', maxLength: 7 },
    { code: 'vg', nameEs: 'Islas Vírgenes Británicas', nameEn: 'British Virgin Islands', dial_code: '+1284', maxLength: 7 },
    { code: 'il', nameEs: 'Israel', nameEn: 'Israel', dial_code: '+972', maxLength: 9 },
    { code: 'it', nameEs: 'Italia', nameEn: 'Italy', dial_code: '+39', maxLength: 10 },
    { code: 'jm', nameEs: 'Jamaica', nameEn: 'Jamaica', dial_code: '+1876', maxLength: 7 },
    { code: 'jp', nameEs: 'Japón', nameEn: 'Japan', dial_code: '+81', maxLength: 10 },
    { code: 'jo', nameEs: 'Jordania', nameEn: 'Jordan', dial_code: '+962', maxLength: 9 },
    { code: 'kz', nameEs: 'Kazajistán', nameEn: 'Kazakhstan', dial_code: '+7', maxLength: 10 },
    { code: 'ke', nameEs: 'Kenia', nameEn: 'Kenya', dial_code: '+254', maxLength: 9 },
    { code: 'kg', nameEs: 'Kirguistán', nameEn: 'Kyrgyzstan', dial_code: '+996', maxLength: 9 },
    { code: 'ki', nameEs: 'Kiribati', nameEn: 'Kiribati', dial_code: '+686', maxLength: 8 },
    { code: 'kw', nameEs: 'Kuwait', nameEn: 'Kuwait', dial_code: '+965', maxLength: 8 },
    { code: 'la', nameEs: 'Laos', nameEn: 'Laos', dial_code: '+856', maxLength: 9 },
    { code: 'ls', nameEs: 'Lesoto', nameEn: 'Lesotho', dial_code: '+266', maxLength: 8 },
    { code: 'lv', nameEs: 'Letonia', nameEn: 'Latvia', dial_code: '+371', maxLength: 8 },
    { code: 'lb', nameEs: 'Líbano', nameEn: 'Lebanon', dial_code: '+961', maxLength: 8 },
    { code: 'lr', nameEs: 'Liberia', nameEn: 'Liberia', dial_code: '+231', maxLength: 8 },
    { code: 'ly', nameEs: 'Libia', nameEn: 'Libya', dial_code: '+218', maxLength: 9 },
    { code: 'li', nameEs: 'Liechtenstein', nameEn: 'Liechtenstein', dial_code: '+423', maxLength: 7 },
    { code: 'lt', nameEs: 'Lituania', nameEn: 'Lithuania', dial_code: '+370', maxLength: 8 },
    { code: 'lu', nameEs: 'Luxemburgo', nameEn: 'Luxembourg', dial_code: '+352', maxLength: 9 },
    { code: 'mg', nameEs: 'Madagascar', nameEn: 'Madagascar', dial_code: '+261', maxLength: 9 },
    { code: 'my', nameEs: 'Malasia', nameEn: 'Malaysia', dial_code: '+60', maxLength: 10 },
    { code: 'mw', nameEs: 'Malaui', nameEn: 'Malawi', dial_code: '+265', maxLength: 9 },
    { code: 'mv', nameEs: 'Maldivas', nameEn: 'Maldives', dial_code: '+960', maxLength: 7 },
    { code: 'ml', nameEs: 'Malí', nameEn: 'Mali', dial_code: '+223', maxLength: 8 },
    { code: 'mt', nameEs: 'Malta', nameEn: 'Malta', dial_code: '+356', maxLength: 8 },
    { code: 'ma', nameEs: 'Marruecos', nameEn: 'Morocco', dial_code: '+212', maxLength: 9 },
    { code: 'mu', nameEs: 'Mauricio', nameEn: 'Mauritius', dial_code: '+230', maxLength: 8 },
    { code: 'mr', nameEs: 'Mauritania', nameEn: 'Mauritania', dial_code: '+222', maxLength: 8 },
    { code: 'mx', nameEs: 'México', nameEn: 'Mexico', dial_code: '+52', maxLength: 10 },
    { code: 'fm', nameEs: 'Micronesia', nameEn: 'Micronesia', dial_code: '+691', maxLength: 7 },
    { code: 'md', nameEs: 'Moldavia', nameEn: 'Moldova', dial_code: '+373', maxLength: 8 },
    { code: 'mc', nameEs: 'Mónaco', nameEn: 'Monaco', dial_code: '+377', maxLength: 8 },
    { code: 'mn', nameEs: 'Mongolia', nameEn: 'Mongolia', dial_code: '+976', maxLength: 8 },
    { code: 'me', nameEs: 'Montenegro', nameEn: 'Montenegro', dial_code: '+382', maxLength: 8 },
    { code: 'mz', nameEs: 'Mozambique', nameEn: 'Mozambique', dial_code: '+258', maxLength: 9 },
    { code: 'na', nameEs: 'Namibia', nameEn: 'Namibia', dial_code: '+264', maxLength: 9 },
    { code: 'np', nameEs: 'Nepal', nameEn: 'Nepal', dial_code: '+977', maxLength: 10 },
    { code: 'ni', nameEs: 'Nicaragua', nameEn: 'Nicaragua', dial_code: '+505', maxLength: 8 },
    { code: 'ne', nameEs: 'Níger', nameEn: 'Niger', dial_code: '+227', maxLength: 8 },
    { code: 'ng', nameEs: 'Nigeria', nameEn: 'Nigeria', dial_code: '+234', maxLength: 10 },
    { code: 'no', nameEs: 'Noruega', nameEn: 'Norway', dial_code: '+47', maxLength: 8 },
    { code: 'nz', nameEs: 'Nueva Zelanda', nameEn: 'New Zealand', dial_code: '+64', maxLength: 9 },
    { code: 'om', nameEs: 'Omán', nameEn: 'Oman', dial_code: '+968', maxLength: 8 },
    { code: 'nl', nameEs: 'Países Bajos', nameEn: 'Netherlands', dial_code: '+31', maxLength: 9 },
    { code: 'pk', nameEs: 'Pakistán', nameEn: 'Pakistan', dial_code: '+92', maxLength: 10 },
    { code: 'pw', nameEs: 'Palau', nameEn: 'Palau', dial_code: '+680', maxLength: 7 },
    { code: 'ps', nameEs: 'Palestina', nameEn: 'Palestine', dial_code: '+970', maxLength: 9 },
    { code: 'pa', nameEs: 'Panamá', nameEn: 'Panama', dial_code: '+507', maxLength: 8 },
    { code: 'pg', nameEs: 'Papúa Nueva Guinea', nameEn: 'Papua New Guinea', dial_code: '+675', maxLength: 8 },
    { code: 'py', nameEs: 'Paraguay', nameEn: 'Paraguay', dial_code: '+595', maxLength: 9 },
    { code: 'pe', nameEs: 'Perú', nameEn: 'Peru', dial_code: '+51', maxLength: 9 },
    { code: 'pl', nameEs: 'Polonia', nameEn: 'Poland', dial_code: '+48', maxLength: 9 },
    { code: 'pt', nameEs: 'Portugal', nameEn: 'Portugal', dial_code: '+351', maxLength: 9 },
    { code: 'pr', nameEs: 'Puerto Rico', nameEn: 'Puerto Rico', dial_code: '+1787', maxLength: 10 },
    { code: 'gb', nameEs: 'Reino Unido', nameEn: 'United Kingdom', dial_code: '+44', maxLength: 10 },
    { code: 'cf', nameEs: 'República Centroafricana', nameEn: 'Central African Republic', dial_code: '+236', maxLength: 8 },
    { code: 'cz', nameEs: 'República Checa', nameEn: 'Czech Republic', dial_code: '+420', maxLength: 9 },
    { code: 'do', nameEs: 'República Dominicana', nameEn: 'Dominican Republic', dial_code: '+1809', maxLength: 10 },
    { code: 'rw', nameEs: 'Ruanda', nameEn: 'Rwanda', dial_code: '+250', maxLength: 9 },
    { code: 'ro', nameEs: 'Rumanía', nameEn: 'Romania', dial_code: '+40', maxLength: 9 },
    { code: 'ru', nameEs: 'Rusia', nameEn: 'Russia', dial_code: '+7', maxLength: 10 },
    { code: 'ws', nameEs: 'Samoa', nameEn: 'Samoa', dial_code: '+685', maxLength: 7 },
    { code: 'kn', nameEs: 'San Cristóbal y Nieves', nameEn: 'Saint Kitts and Nevis', dial_code: '+1869', maxLength: 7 },
    { code: 'sm', nameEs: 'San Marino', nameEn: 'San Marino', dial_code: '+378', maxLength: 9 },
    { code: 'vc', nameEs: 'San Vicente y las Granadinas', nameEn: 'Saint Vincent and the Grenadines', dial_code: '+1784', maxLength: 7 },
    { code: 'lc', nameEs: 'Santa Lucía', nameEn: 'Saint Lucia', dial_code: '+1758', maxLength: 7 },
    { code: 'st', nameEs: 'Santo Tomé y Príncipe', nameEn: 'São Tomé and Príncipe', dial_code: '+239', maxLength: 7 },
    { code: 'sn', nameEs: 'Senegal', nameEn: 'Senegal', dial_code: '+221', maxLength: 9 },
    { code: 'rs', nameEs: 'Serbia', nameEn: 'Serbia', dial_code: '+381', maxLength: 9 },
    { code: 'sc', nameEs: 'Seychelles', nameEn: 'Seychelles', dial_code: '+248', maxLength: 7 },
    { code: 'sl', nameEs: 'Sierra Leona', nameEn: 'Sierra Leone', dial_code: '+232', maxLength: 8 },
    { code: 'sg', nameEs: 'Singapur', nameEn: 'Singapore', dial_code: '+65', maxLength: 8 },
    { code: 'so', nameEs: 'Somalia', nameEn: 'Somalia', dial_code: '+252', maxLength: 9 },
    { code: 'lk', nameEs: 'Sri Lanka', nameEn: 'Sri Lanka', dial_code: '+94', maxLength: 9 },
    { code: 'za', nameEs: 'Sudáfrica', nameEn: 'South Africa', dial_code: '+27', maxLength: 9 },
    { code: 'sd', nameEs: 'Sudán', nameEn: 'Sudan', dial_code: '+249', maxLength: 9 },
    { code: 'ss', nameEs: 'Sudán del Sur', nameEn: 'South Sudan', dial_code: '+211', maxLength: 9 },
    { code: 'se', nameEs: 'Suecia', nameEn: 'Sweden', dial_code: '+46', maxLength: 9 },
    { code: 'ch', nameEs: 'Suiza', nameEn: 'Switzerland', dial_code: '+41', maxLength: 9 },
    { code: 'sr', nameEs: 'Surinam', nameEn: 'Suriname', dial_code: '+597', maxLength: 7 },
    { code: 'th', nameEs: 'Tailandia', nameEn: 'Thailand', dial_code: '+66', maxLength: 9 },
    { code: 'tz', nameEs: 'Tanzania', nameEn: 'Tanzania', dial_code: '+255', maxLength: 9 },
    { code: 'tj', nameEs: 'Tayikistán', nameEn: 'Tajikistan', dial_code: '+992', maxLength: 9 },
    { code: 'tl', nameEs: 'Timor Oriental', nameEn: 'East Timor', dial_code: '+670', maxLength: 8 },
    { code: 'tg', nameEs: 'Togo', nameEn: 'Togo', dial_code: '+228', maxLength: 8 },
    { code: 'to', nameEs: 'Tonga', nameEn: 'Tonga', dial_code: '+676', maxLength: 7 },
    { code: 'tt', nameEs: 'Trinidad y Tobago', nameEn: 'Trinidad and Tobago', dial_code: '+1868', maxLength: 7 },
    { code: 'tn', nameEs: 'Túnez', nameEn: 'Tunisia', dial_code: '+216', maxLength: 8 },
    { code: 'tm', nameEs: 'Turkmenistán', nameEn: 'Turkmenistan', dial_code: '+993', maxLength: 8 },
    { code: 'tr', nameEs: 'Turquía', nameEn: 'Turkey', dial_code: '+90', maxLength: 10 },
    { code: 'tv', nameEs: 'Tuvalu', nameEn: 'Tuvalu', dial_code: '+688', maxLength: 6 },
    { code: 'ua', nameEs: 'Ucrania', nameEn: 'Ukraine', dial_code: '+380', maxLength: 9 },
    { code: 'ug', nameEs: 'Uganda', nameEn: 'Uganda', dial_code: '+256', maxLength: 9 },
    { code: 'uy', nameEs: 'Uruguay', nameEn: 'Uruguay', dial_code: '+598', maxLength: 8 },
    { code: 'uz', nameEs: 'Uzbekistán', nameEn: 'Uzbekistan', dial_code: '+998', maxLength: 9 },
    { code: 'vu', nameEs: 'Vanuatu', nameEn: 'Vanuatu', dial_code: '+678', maxLength: 7 },
    { code: 've', nameEs: 'Venezuela', nameEn: 'Venezuela', dial_code: '+58', maxLength: 10 },
    { code: 'vn', nameEs: 'Vietnam', nameEn: 'Vietnam', dial_code: '+84', maxLength: 9 },
    { code: 'ye', nameEs: 'Yemen', nameEn: 'Yemen', dial_code: '+967', maxLength: 9 },
    { code: 'dj', nameEs: 'Yibuti', nameEn: 'Djibouti', dial_code: '+253', maxLength: 8 },
    { code: 'zm', nameEs: 'Zambia', nameEn: 'Zambia', dial_code: '+260', maxLength: 9 },
    { code: 'zw', nameEs: 'Zimbabue', nameEn: 'Zimbabwe', dial_code: '+263', maxLength: 9 },
];

export function FormRegisterEnvejecimiento(props) {
    const { onBack } = props;
    const { login } = useAuth();
    const { language, toggleLanguage } = useSettings();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(
        countriesData.find(c => c.code === 'mx')
    );
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    const getCountryName = (country) => language === 'en' ? country.nameEn : country.nameEs;

    const filteredCountries = countriesData.filter(c =>
        getCountryName(c).toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.dial_code.includes(countrySearch)
    );

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowCountryDropdown(false);
                setCountrySearch('');
            }
        }
        if (showCountryDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showCountryDropdown]);

    const en = language === 'en';

    const formik = useFormik({
        initialValues: {
            nombre: "",
            apellido_paterno: "",
            apellido_materno: "",
            telefono: "",
            fecha_nacimiento: "",
            password: "",
            confirm_password: "",
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .min(2, en ? "Name is too short" : "El nombre es demasiado corto")
                .required(en ? "Name is required" : "El nombre es obligatorio"),
            apellido_paterno: Yup.string()
                .min(2, en ? "Last name is too short" : "El apellido es demasiado corto")
                .required(en ? "Last name is required" : "El apellido paterno es obligatorio"),
            apellido_materno: Yup.string(),
            telefono: Yup.string()
                .matches(/^[0-9]+$/, en ? "Digits only" : "Solo dígitos")
                .min(8, en ? "Number too short" : "Número demasiado corto")
                .max(15, en ? "Number too long" : "Número demasiado largo")
                .required(en ? "Phone is required" : "El teléfono es obligatorio"),
            fecha_nacimiento: Yup.date()
                .required(en ? "Date of birth is required" : "La fecha de nacimiento es obligatoria"),
            password: Yup.string()
                .min(6, en ? "Password must be at least 6 characters" : "La contraseña debe tener al menos 6 caracteres")
                .required(en ? "Password is required" : "La contraseña es obligatoria"),
            confirm_password: Yup.string()
                .oneOf([Yup.ref('password'), null], en ? "Passwords do not match" : "Las contraseñas no coinciden")
                .required(en ? "Confirm your password" : "Confirma tu contraseña"),
        }),
        validateOnChange: false,
        onSubmit: async (formvalue) => {
            try {
                setShowCountryDropdown(false);
                setCountrySearch('');
                setIsLoading(true);

                const celular_paciente = `${selectedCountry.dial_code}${formvalue.telefono}`;
                const payload = {
                    nombre: formvalue.nombre,
                    apellido_paterno: formvalue.apellido_paterno,
                    apellido_materno: formvalue.apellido_materno || "",
                    fecha_nacimiento: formvalue.fecha_nacimiento,
                    celular_paciente,
                    password: formvalue.password,
                };

                await registerApiEnvejecimiento(payload);

                const loginResponse = await loginApiEnvejecimiento({ celular_paciente, password: formvalue.password });
                const { access } = loginResponse;
                await login(access, 6);

                onBack();
            } catch (error) {
                console.error(`[FormRegisterEnvejecimiento] Error en registro:`, error);
                toast.error(error.message || (en ? "Registration error. Please verify your data." : "Error al registrarse. Verifica los datos ingresados."));
            } finally {
                setIsLoading(false);
            }
        },
    });

    const phoneLength = formik.values.telefono.length;
    const phoneIncomplete = phoneLength > 0 && phoneLength < selectedCountry.maxLength;

    return (
        <div className="env-register-bg">
            {/* Language toggle — top right */}
            <button className="env-reg-lang-toggle" type="button" onClick={toggleLanguage} title={en ? 'Cambiar a Español' : 'Switch to English'}>
                <span className="env-reg-lang-flag">{getFlagEmoji(en ? 'us' : 'mx')}</span>
                <FiGlobe className="env-reg-lang-globe" />
            </button>

            <div className="env-register-wrapper">
                <div className="env-register-card">

                    <div className="env-register-header">
                        <div className="env-register-logo">
                            <img src={logoColor} alt="Mente Conecta" />
                        </div>
                        <h2>{en ? 'Create Account' : 'Crear Cuenta'}</h2>
                        <p>{en ? 'Complete your details to register on the platform.' : 'Completa tus datos para registrarte en la plataforma.'}</p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="env-register-form">

                        {/* First name + Last name */}
                        <div className="env-register-row">
                            <div className="env-reg-input-group">
                                <div className="env-reg-input-wrapper"
                                    style={{ borderColor: formik.errors.nombre && formik.touched.nombre ? '#e53e3e' : undefined }}>
                                    <input
                                        type="text"
                                        name="nombre"
                                        placeholder={en ? 'First Name(s)' : 'Nombre(s)'}
                                        value={formik.values.nombre}
                                        onChange={formik.handleChange}
                                        disabled={isLoading}
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                </div>
                                {formik.errors.nombre && formik.touched.nombre && (
                                    <span className="env-reg-error">{formik.errors.nombre}</span>
                                )}
                            </div>
                            <div className="env-reg-input-group">
                                <div className="env-reg-input-wrapper"
                                    style={{ borderColor: formik.errors.apellido_paterno && formik.touched.apellido_paterno ? '#e53e3e' : undefined }}>
                                    <input
                                        type="text"
                                        name="apellido_paterno"
                                        placeholder={en ? 'Last Name' : 'Apellido Paterno'}
                                        value={formik.values.apellido_paterno}
                                        onChange={formik.handleChange}
                                        disabled={isLoading}
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                </div>
                                {formik.errors.apellido_paterno && formik.touched.apellido_paterno && (
                                    <span className="env-reg-error">{formik.errors.apellido_paterno}</span>
                                )}
                            </div>
                        </div>

                        {/* Second last name */}
                        <div className="env-reg-input-group">
                            <div className="env-reg-input-wrapper">
                                <input
                                    type="text"
                                    name="apellido_materno"
                                    placeholder={en ? 'Second Last Name (Optional)' : 'Apellido Materno (Opcional)'}
                                    value={formik.values.apellido_materno}
                                    onChange={formik.handleChange}
                                    disabled={isLoading}
                                    style={{ textTransform: 'uppercase' }}
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="env-reg-input-group">
                            <span className="env-reg-floating-label">{en ? 'Mobile phone' : 'Teléfono móvil'}</span>
                            <div className="env-reg-input-wrapper"
                                style={{ borderColor: (formik.errors.telefono && formik.touched.telefono) || phoneIncomplete ? '#e53e3e' : undefined }}>
                                <div ref={dropdownRef} className="env-reg-phone-prefix" onClick={() => setShowCountryDropdown(!showCountryDropdown)}>
                                    <span className="env-reg-flag-emoji">{getFlagEmoji(selectedCountry.code)}</span>
                                    <span className="arrow">▼</span>
                                    <span>{selectedCountry.dial_code}</span>

                                    {showCountryDropdown && (
                                        <div className="env-reg-country-dropdown" onClick={(e) => e.stopPropagation()}>
                                            <div className="env-reg-country-search-wrapper">
                                                <input
                                                    ref={searchInputRef}
                                                    type="text"
                                                    className="env-reg-country-search"
                                                    placeholder={en ? 'Search country...' : 'Buscar País...'}
                                                    value={countrySearch}
                                                    onChange={(e) => setCountrySearch(e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                            <div className="env-reg-country-list">
                                                {filteredCountries.length === 0 ? (
                                                    <div className="env-reg-country-no-results">
                                                        {en ? 'No results' : 'Sin resultados'}
                                                    </div>
                                                ) : filteredCountries.map((country) => (
                                                    <div
                                                        key={country.code}
                                                        className={`env-reg-country-item${selectedCountry.code === country.code ? ' selected' : ''}`}
                                                        onClick={() => {
                                                            setSelectedCountry(country);
                                                            setShowCountryDropdown(false);
                                                            setCountrySearch('');
                                                        }}
                                                    >
                                                        <span className="env-reg-flag-emoji">{getFlagEmoji(country.code)}</span>
                                                        <span className="env-reg-country-name">{getCountryName(country)}</span>
                                                        <span className="env-reg-country-dial">{country.dial_code}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="env-reg-phone-divider"></div>
                                <input
                                    type="tel"
                                    name="telefono"
                                    placeholder=""
                                    maxLength={selectedCountry.maxLength}
                                    value={formik.values.telefono}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        formik.setFieldValue("telefono", val);
                                    }}
                                    disabled={isLoading}
                                    autoComplete="tel"
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
                                <span className="env-reg-error">
                                    {phoneIncomplete
                                        ? (en ? 'Invalid or incomplete phone number' : 'Número de teléfono inválido o incompleto')
                                        : (formik.errors.telefono && formik.touched.telefono ? formik.errors.telefono : '')
                                    }
                                </span>
                                <span className={`env-reg-char-counter${phoneIncomplete ? ' env-reg-char-counter-error' : ''}`}>
                                    {phoneLength}/{selectedCountry.maxLength}
                                </span>
                            </div>
                        </div>

                        {/* Date of birth */}
                        <div className="env-reg-input-group">
                            <span className="env-reg-floating-label">{en ? 'Date of Birth' : 'Fecha de Nacimiento'}</span>
                            <div className="env-reg-input-wrapper"
                                style={{ borderColor: formik.errors.fecha_nacimiento && formik.touched.fecha_nacimiento ? '#e53e3e' : undefined }}>
                                <input
                                    type="date"
                                    name="fecha_nacimiento"
                                    value={formik.values.fecha_nacimiento}
                                    onChange={formik.handleChange}
                                    disabled={isLoading}
                                    style={{ color: formik.values.fecha_nacimiento ? '#2d3748' : '#a0aec0' }}
                                />
                            </div>
                            {formik.errors.fecha_nacimiento && formik.touched.fecha_nacimiento && (
                                <span className="env-reg-error">{formik.errors.fecha_nacimiento}</span>
                            )}
                        </div>

                        {/* Password + Confirm */}
                        <div className="env-register-row">
                            <div className="env-reg-input-group">
                                <div className="env-reg-input-wrapper"
                                    style={{ borderColor: formik.errors.password && formik.touched.password ? '#e53e3e' : undefined }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder={en ? 'Password' : 'Contraseña'}
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        disabled={isLoading}
                                        autoComplete="new-password"
                                    />
                                    <button type="button" className="env-reg-toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                        title={showPassword ? (en ? 'Hide' : 'Ocultar') : (en ? 'Show' : 'Mostrar')}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {formik.errors.password && formik.touched.password && (
                                    <span className="env-reg-error">{formik.errors.password}</span>
                                )}
                            </div>
                            <div className="env-reg-input-group">
                                <div className="env-reg-input-wrapper"
                                    style={{ borderColor: formik.errors.confirm_password && formik.touched.confirm_password ? '#e53e3e' : undefined }}>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirm_password"
                                        placeholder={en ? 'Confirm Password' : 'Confirmar Contraseña'}
                                        value={formik.values.confirm_password}
                                        onChange={formik.handleChange}
                                        disabled={isLoading}
                                        autoComplete="new-password"
                                    />
                                    <button type="button" className="env-reg-toggle-password"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        title={showConfirmPassword ? (en ? 'Hide' : 'Ocultar') : (en ? 'Show' : 'Mostrar')}>
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {formik.errors.confirm_password && formik.touched.confirm_password && (
                                    <span className="env-reg-error">{formik.errors.confirm_password}</span>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="env-btn-registrarse" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                    {en ? 'Registering...' : 'Registrando...'}
                                </>
                            ) : (
                                en ? 'Register' : 'Registrarse'
                            )}
                        </button>

                        <button type="button" className="env-btn-volver" onClick={onBack} disabled={isLoading}>
                            {en ? 'Back' : 'Regresar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
