import { useState } from 'react'

export default function Gallery({ vehicle }) {
  const { year, make, model, submodel, drivetrain } = vehicle || {}
  const [viewerImage, setViewerImage] = useState(null)

  function handleSaveToBuild(image) {
    console.log('Saving image to build:', image)
  }

  return (
    <section className="card-style">
      <h4 className="font-semibold text-lg mb-3">Gallery Preview</h4>
      <p className="text-sm text-neutral-600 mb-4">
        {year && make && model
          ? `Previewing ${year} ${make} ${model} ${submodel || ''} ${drivetrain ? `(${drivetrain})` : ''}`
          : 'Select a vehicle to preview.'}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="cursor-zoom-in aspect-[4/3] bg-gray-200 rounded-xl" onClick={() => setViewerImage({ url: '', caption: 'Image 1' })}>
          <img src="" alt="Image 1" className="w-full h-full object-cover rounded-xl" />
        </div>
        <button onClick={() => handleSaveToBuild({ url: '', caption: 'Image 1' })} className="mt-1 text-xs text-blue-600 hover:underline">
          Save to Build
        </button>
        <div className="cursor-zoom-in aspect-[4/3] bg-gray-200 rounded-xl" onClick={() => setViewerImage({ url: '', caption: 'Image 2' })}>
          <img src="" alt="Image 2" className="w-full h-full object-cover rounded-xl" />
        </div>
        <button onClick={() => handleSaveToBuild({ url: '', caption: 'Image 2' })} className="mt-1 text-xs text-blue-600 hover:underline">
          Save to Build
        </button>
      </div>
      {viewerImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center" onClick={() => setViewerImage(null)}>
          <img src={viewerImage.url} alt={viewerImage.caption} className="max-w-full max-h-full rounded-lg" />
        </div>
      )}
    </section>
  )
}
