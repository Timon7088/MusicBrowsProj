import {
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <h1 className="text-4xl font-bold text-green-400 mb-8">צור קשר</h1>

      <div
        className="max-w-xl w-full bg-gray-800 p-6 rounded-lg shadow-md text-right"
        dir="rtl"
      >
        <p className="text-gray-300 mb-4">ניתן לפנות אלינו בכמה דרכים:</p>

        <ul className="space-y-4 text-gray-300 mb-6">
          <li className="flex items-start space-x-2 rtl:space-x-reverse">
            <FaEnvelope className="text-green-400 mt-1" />
            <span>
              מייל: <span className="text-green-400">MusicBrows@gmail.com</span>
            </span>
          </li>
          <li className="flex items-start space-x-2 rtl:space-x-reverse">
            <FaPhone className="text-green-400 mt-1" />
            <span>
              טלפון: <span className="text-green-400">054-1234567</span>
            </span>
          </li>
          <li className="flex items-start space-x-2 rtl:space-x-reverse">
            <FaFacebook className="text-green-400 mt-1" />
            <a
              href="https://www.facebook.com/MusicBrows"
              target="_blank"
              className="text-green-400 hover:underline"
            >
              MusicBrows
            </a>
          </li>
          <li className="flex items-start space-x-2 rtl:space-x-reverse">
            <FaMapMarkerAlt className="text-green-400 mt-1" />
            <span>
              מיקום: <span className="text-green-400">הערבה 26, תל מונד</span>
            </span>
          </li>
        </ul>

        <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
          <iframe
            title="מיקום החברה"
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3374.285605054658!2d34.912271000000004!3d32.250397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzLCsDE1JzAxLjQiTiAzNMKwNTQnNDQuMiJF!5e0!3m2!1sen!2sil!4v1745861210015!5m2!1sen!2sil"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
