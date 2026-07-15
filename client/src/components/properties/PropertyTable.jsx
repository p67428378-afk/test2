import React from "react";

export default function PropertyTable({ properties, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto bg-surface-container-lowest rounded-lg border border-outline-variant">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-label-md text-label-md">
            <th className="p-md">Title</th>
            <th className="p-md">Location</th>
            <th className="p-md">Price</th>
            <th className="p-md">Beds/Baths</th>
            <th className="p-md text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/40 text-body-sm text-on-surface">
          {properties.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-xl text-center text-outline">
                No listings found. Create your first property listing!
              </td>
            </tr>
          ) : (
            properties.map((property) => (
              <tr
                key={property.id}
                className="hover:bg-surface-container-low/30 transition-colors"
              >
                <td className="p-md font-bold">{property.title}</td>
                <td className="p-md">{property.location}</td>
                <td className="p-md">
                  ${property.price ? property.price.toLocaleString() : "0"}
                </td>
                <td className="p-md">
                  {property.bedrooms} Beds / {property.bathrooms} Baths
                </td>
                <td className="p-md text-right space-x-sm">
                  <button
                    onClick={() => onEdit(property)}
                    className="px-3 py-1.5 bg-primary-fixed text-on-primary-fixed rounded hover:bg-primary-fixed-dim transition-colors font-label-sm text-label-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(property.id)}
                    className="px-3 py-1.5 bg-error-container text-on-error-container rounded hover:opacity-90 transition-colors font-label-sm text-label-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
