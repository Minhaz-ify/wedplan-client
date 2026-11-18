"use client";
export default function Error({ reset }) {
  return (
    <div className="container-x flex flex-col items-center py-28 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <button onClick={reset} className="btn-primary mt-6">Try again</button>
    </div>
  );
}
