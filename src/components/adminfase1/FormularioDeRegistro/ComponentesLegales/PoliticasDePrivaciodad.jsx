import React from 'react';
import { useTranslation } from 'react-i18next';

export function PoliticaDePrivacidad() {
    const { i18n } = useTranslation();
    const isEn = i18n.language === 'en';

    if (isEn) {
        return (
            <>
                <h3>1. Introduction</h3>
                <p>This privacy policy describes how we collect, use, and protect the personal information of users of our medical care mobile application. By using our application, you accept the terms of this privacy policy.</p>
                
                <h3>2. Information We Collect</h3>
                <p><strong>General Data:</strong> We collect information such as name, email address, date of birth, and gender to create and manage user accounts.</p>
                <p><strong>Clinical Data:</strong> To provide medical services, we collect information on symptoms, diagnoses, treatments, and medications.</p>

                <h3>3. Use of Information</h3>
                <p>• We use the collected information to:</p>
                <p style={{ paddingLeft: '20px' }}>- Provide medical services and manage user accounts.</p>
                <p style={{ paddingLeft: '20px' }}>- Personalize the user experience.</p>
                <p style={{ paddingLeft: '20px' }}>- Perform statistical analysis and improve our services.</p>

                <h3>4. Sharing Information</h3>
                <p>We do not share personal information with third parties without the user's consent, except when necessary to provide medical services or comply with the law.</p>

                <h3>5. Data Security</h3>
                <p>We implement security measures to protect personal information. Clinical data is stored securely and is only accessible by authorized medical professionals.</p>

                <h3>6. User Rights</h3>
                <p>Users have the right to access, correct, or delete their personal information. They can withdraw their consent at any time.</p>

                <h3>7. Contact</h3>
                <p>If you have questions or concerns about our privacy policy, contact us through our email address.</p>
            </>
        );
    }

    return (
        <>
            <h3>1. Introducción</h3>
            <p>Esta política de privacidad describe cómo recopilamos, utilizamos y protegemos la información personal de los usuarios de nuestra aplicación móvil de atención médica. Al utilizar nuestra aplicación, aceptas los términos de esta política de privacidad.</p>
            
            <h3>2. Información que Recopilamos</h3>
            <p><strong>Datos Generales:</strong> Recopilamos información como nombre, dirección de correo electrónico, fecha de nacimiento y género para crear y gestionar cuentas de usuario.</p>
            <p><strong>Datos Clínicos:</strong> Para proporcionar servicios médicos, recopilamos información sobre síntomas, diagnósticos, tratamientos y medicamentos.</p>

            <h3>3. Uso de la Información</h3>
            <p>• Utilizamos la información recopilada para:</p>
            <p style={{ paddingLeft: '20px' }}>- Proporcionar servicios médicos y gestionar cuentas de usuario.</p>
            <p style={{ paddingLeft: '20px' }}>- Personalizar la experiencia del usuario.</p>
            <p style={{ paddingLeft: '20px' }}>- Realizar análisis estadísticos y mejorar nuestros servicios.</p>

            <h3>4. Compartir Información</h3>
            <p>No compartimos información personal con terceros sin el consentimiento del usuario, excepto cuando sea necesario para brindar servicios médicos o cumplir con la ley.</p>

            <h3>5. Seguridad de Datos</h3>
            <p>Implementamos medidas de seguridad para proteger la información personal. Los datos clínicos se almacenan de forma segura y solo son accesibles por profesionales médicos autorizados.</p>

            <h3>6. Derechos del Usuario</h3>
            <p>Los usuarios tienen derecho a acceder, corregir o eliminar su información personal. Pueden retirar su consentimiento en cualquier momento.</p>

            <h3>7. Contacto</h3>
            <p>Si tienes preguntas o preocupaciones sobre nuestra política de privacidad, contáctanos a través de la dirección de correo electrónico.</p>
        </>
    );
}