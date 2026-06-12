import React from 'react';
import { User, Mail, Phone, Calendar, MapPin, CreditCard } from 'lucide-react';

export default function PersonalDetailsCard({ customer = {} }) {
  return (
    <div className="bg-surface-container rounded-lg border border-outline-variant p-6 space-y-6">
      <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Personal Details</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Verified customer profile information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-on-surface-variant mt-0.5 shrink-0" />
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Full Name</p>
            <p className="font-body-lg text-body-lg text-on-surface mt-1">{`${customer.firstName || ''} ${customer.lastName || ''}`}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-on-surface-variant mt-0.5 shrink-0" />
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Email Address</p>
            <p className="font-body-lg text-body-lg text-on-surface mt-1">{customer.email || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-on-surface-variant mt-0.5 shrink-0" />
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Phone Number</p>
            <p className="font-body-lg text-body-lg text-on-surface mt-1">{customer.phone || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-on-surface-variant mt-0.5 shrink-0" />
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Date of Birth</p>
            <p className="font-body-lg text-body-lg text-on-surface mt-1">{customer.dateOfBirth || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 md:col-span-2">
          <MapPin className="w-5 h-5 text-on-surface-variant mt-0.5 shrink-0" />
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Residential Address</p>
            <p className="font-body-lg text-body-lg text-on-surface mt-1">{customer.address || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-on-surface-variant mt-0.5 shrink-0" />
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Aadhaar Number</p>
            <p className="font-body-lg text-body-lg text-on-surface mt-1">{customer.aadhaarNumber || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-on-surface-variant mt-0.5 shrink-0" />
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">PAN Number</p>
            <p className="font-body-lg text-body-lg text-on-surface mt-1">{customer.panNumber || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}