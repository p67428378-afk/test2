import React from 'react';
import { Terminal, Play, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ApiReferencePage() {
  return (
    <div className='w-full h-full overflow-y-auto pr-sm space-y-lg pb-xl'>
      <div>
        <h1 className='font-display-sm text-display-sm font-bold text-primary mb-xs'>API Reference</h1>
        <p className='text-on-surface-variant font-body-md'>
          Integrate the CalcAPI arithmetic engine into your own applications.
        </p>
      </div>

      {/* POST Endpoint */}
      <div className='glass-panel rounded-xl p-md border border-outline-variant/30 space-y-md'>
        <div className='flex items-center justify-between flex-wrap gap-sm'>
          <div className='flex items-center gap-sm'>
            <span className='bg-secondary-container/20 text-secondary-fixed border border-secondary-fixed/30 px-sm py-unit rounded font-label-sm text-label-sm font-bold'>
              POST
            </span>
            <code className='font-label-md text-label-md text-on-surface'>/api/v1/calculate</code>
          </div>
          <span className='text-outline-variant font-label-sm text-label-sm'>Calculate via Request Body</span>
        </div>

        <p className='text-on-surface-variant font-body-md'>
          Performs a calculation based on the provided operands and operator in the JSON request body.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-md'>
          <div className='space-y-sm'>
            <span className='font-label-sm text-label-sm text-outline-variant uppercase tracking-wider block'>Request Body</span>
            <pre className='bg-surface-container-low p-sm rounded-lg border border-outline-variant/20 font-label-sm text-label-sm text-on-surface overflow-x-auto'>
              {JSON.stringify({ operand1: 25, operand2: 5, operator: "/" }, null, 2)}
            </pre>
          </div>

          <div className='space-y-sm'>
            <span className='font-label-sm text-label-sm text-outline-variant uppercase tracking-wider block'>Response (200 OK)</span>
            <pre className='bg-surface-container-low p-sm rounded-lg border border-outline-variant/20 font-label-sm text-label-sm text-on-surface overflow-x-auto'>
              {JSON.stringify({ result: 5 }, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* GET Endpoint */}
      <div className='glass-panel rounded-xl p-md border border-outline-variant/30 space-y-md'>
        <div className='flex items-center justify-between flex-wrap gap-sm'>
          <div className='flex items-center gap-sm'>
            <span className='bg-primary-container/20 text-primary border border-primary/30 px-sm py-unit rounded font-label-sm text-label-sm font-bold'>
              GET
            </span>
            <code className='font-label-md text-label-md text-on-surface'>/api/v1/calculate</code>
          </div>
          <span className='text-outline-variant font-label-sm text-label-sm'>Calculate via Query Parameters</span>
        </div>

        <p className='text-on-surface-variant font-body-md'>
          Performs a calculation based on query parameters.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-md'>
          <div className='space-y-sm'>
            <span className='font-label-sm text-label-sm text-outline-variant uppercase tracking-wider block'>Query Parameters</span>
            <div className='bg-surface-container-low p-sm rounded-lg border border-outline-variant/20 space-y-xs font-label-sm text-label-sm text-on-surface-variant'>
              <div><strong className='text-on-surface'>operand1</strong> (number, required): First operand</div>
              <div><strong className='text-on-surface'>operand2</strong> (number, required): Second operand</div>
              <div><strong className='text-on-surface'>operator</strong> (string, required): Arithmetic operator (+, -, *, /)</div>
            </div>
          </div>

          <div className='space-y-sm'>
            <span className='font-label-sm text-label-sm text-outline-variant uppercase tracking-wider block'>Response (200 OK)</span>
            <pre className='bg-surface-container-low p-sm rounded-lg border border-outline-variant/20 font-label-sm text-label-sm text-on-surface overflow-x-auto'>
              {JSON.stringify({ result: 5 }, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Error Responses */}
      <div className='glass-panel rounded-xl p-md border border-outline-variant/30 space-y-sm'>
        <h3 className='font-headline-md text-headline-md text-on-surface flex items-center gap-sm'>
          <AlertTriangle className='w-5 h-5 text-error' />
          Error Responses
        </h3>
        <p className='text-on-surface-variant font-body-md'>
          The API returns a <code className='text-error'>400 Bad Request</code> status code for invalid inputs:
        </p>
        <ul className='list-disc list-inside text-on-surface-variant font-body-md space-y-xs pl-sm'>
          <li>
            <strong>Division by zero:</strong>{' '}
            <code className='text-on-surface'>
              {JSON.stringify({ detail: "Division by zero is not allowed" })}
            </code>
          </li>
          <li>
            <strong>Invalid operator:</strong>{' '}
            <code className='text-on-surface'>
              {JSON.stringify({ detail: "Invalid operator is provided" })}
            </code>
          </li>
        </ul>
      </div>
    </div>
  );
}
