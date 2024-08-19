import { Modal } from "flowbite-react";
import { FaTimes } from "react-icons/fa";

export default function ImageModal({ isOpen, onClose, url, alt = "user_profile_picture" }) {
  return (
    <Modal show={isOpen} onClose={onClose} size="sm" position="center" popup dismissible>
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
      >
        <FaTimes size={16} />
      </button>

      <Modal.Body className="flex items-center justify-center py-4">
        {/* Circular Image */}
        <img
          src={url}
          alt={alt}
          className=" w-56 h-56 rounded-full object-cover"
        />
      </Modal.Body>
    </Modal>
  );
}
