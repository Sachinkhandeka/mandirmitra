import { Modal } from "flowbite-react";
import { FaTimes } from "react-icons/fa";

export default function ImageModal({ isOpen, onClose, url, alt = "user_profile_picture" }) {
  return (
    <Modal show={isOpen} onClose={onClose} size="xl" position="center" popup dismissible>
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-white text-black bg-opacity-70 rounded-full p-1 hover:bg-opacity-100"
      >
        <FaTimes size={16} />
      </button>

      <Modal.Body className="flex items-center justify-center p-0 m-0 bg-black scrollbar-hidden">
        {/* Circular Image */}
        <img
          src={url}
          alt={alt}
          className="max-h-[500px] w-auto object-contain"
        />
      </Modal.Body>
    </Modal>
  );
}
